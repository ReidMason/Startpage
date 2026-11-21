package server_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ReidMason/startpage/internal/oidctest"
)

type appJSON struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	URL      string `json:"url"`
	IconName string `json:"iconName"`
	IconSvg  string `json:"iconSvg"`
}

type groupJSON struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Style     string    `json:"style"`
	Collapsed bool      `json:"collapsed"`
	Apps      []appJSON `json:"apps"`
}

type startpageJSON struct {
	Groups []groupJSON `json:"groups"`
}

func (b *browser) do(method, path string, body any) (*http.Response, []byte) {
	b.t.Helper()
	var reader io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			b.t.Fatal(err)
		}
		reader = bytes.NewReader(raw)
	}
	req, _ := http.NewRequest(method, b.app.URL+path, reader)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	for _, c := range b.cookies {
		req.AddCookie(c)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		b.t.Fatal(err)
	}
	defer resp.Body.Close()
	data, _ := io.ReadAll(resp.Body)
	return resp, data
}

func (b *browser) startpage() startpageJSON {
	b.t.Helper()
	resp, data := b.do(http.MethodGet, "/api/startpage", nil)
	if resp.StatusCode != http.StatusOK {
		b.t.Fatalf("GET /api/startpage: status %d: %s", resp.StatusCode, data)
	}
	var sp startpageJSON
	if err := json.Unmarshal(data, &sp); err != nil {
		b.t.Fatal(err)
	}
	return sp
}

func (b *browser) createApp(body map[string]any) (int, appJSON) {
	b.t.Helper()
	resp, data := b.do(http.MethodPost, "/api/apps", body)
	var created appJSON
	_ = json.Unmarshal(data, &created)
	return resp.StatusCode, created
}

func plexApp(extra map[string]any) map[string]any {
	body := map[string]any{"name": "Plex", "url": "plex.example.com", "iconName": "simple-icons:plex", "iconSvg": "<path d=\"M0 0\"/>"}
	for k, v := range extra {
		body[k] = v
	}
	return body
}

func TestStartpageRequiresSignIn(t *testing.T) {
	ts, _ := startServer(t)
	b := newBrowser(t, ts)

	if resp, _ := b.do(http.MethodGet, "/api/startpage", nil); resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("GET /api/startpage: status %d, want 401", resp.StatusCode)
	}
	if resp, _ := b.do(http.MethodPost, "/api/apps", plexApp(nil)); resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("POST /api/apps: status %d, want 401", resp.StatusCode)
	}
}

func TestNewUserStartpageHasOneEmptyUnlabelledGroup(t *testing.T) {
	b, _ := signedIn(t)

	sp := b.startpage()
	if len(sp.Groups) != 1 {
		t.Fatalf("groups = %d, want 1", len(sp.Groups))
	}
	g := sp.Groups[0]
	if g.Name != "" || g.Style != "tiles" || g.Collapsed || len(g.Apps) != 0 {
		t.Errorf("first group = %+v, want unlabelled, tiles, expanded, empty", g)
	}
	if again := b.startpage(); len(again.Groups) != 1 || again.Groups[0].ID != g.ID {
		t.Errorf("second read changed groups: %+v", again.Groups)
	}
}

func TestCreatedAppsLandInFirstGroupInOrder(t *testing.T) {
	b, _ := signedIn(t)

	status, created := b.createApp(plexApp(nil))
	if status != http.StatusCreated {
		t.Fatalf("create status %d, want 201", status)
	}
	if created.ID == 0 || created.Name != "Plex" || created.URL != "plex.example.com" {
		t.Errorf("created = %+v", created)
	}
	b.createApp(plexApp(map[string]any{"name": "Sonarr", "url": "https://sonarr.example.com/tv"}))
	b.createApp(plexApp(map[string]any{"name": "Radarr"}))

	sp := b.startpage()
	if len(sp.Groups) != 1 {
		t.Fatalf("groups = %d, want 1", len(sp.Groups))
	}
	var names []string
	for _, a := range sp.Groups[0].Apps {
		names = append(names, a.Name)
	}
	if got := len(names); got != 3 || names[0] != "Plex" || names[1] != "Sonarr" || names[2] != "Radarr" {
		t.Errorf("app order = %v, want [Plex Sonarr Radarr]", names)
	}
	first := sp.Groups[0].Apps[0]
	if first.IconName != "simple-icons:plex" || first.IconSvg != "<path d=\"M0 0\"/>" {
		t.Errorf("icon not stored: %+v", first)
	}
	if sp.Groups[0].Apps[1].URL != "https://sonarr.example.com/tv" {
		t.Errorf("URL should be stored as entered, got %q", sp.Groups[0].Apps[1].URL)
	}
}

func TestCreateAppInChosenGroup(t *testing.T) {
	b, dbURL := signedIn(t)
	first := b.startpage().Groups[0]
	execSQL(t, dbURL, "INSERT INTO groups (user_id, name, position) SELECT user_id, 'Media', 1 FROM groups WHERE id = $1", first.ID)
	var second groupJSON
	for _, g := range b.startpage().Groups {
		if g.Name == "Media" {
			second = g
		}
	}
	if second.ID == 0 {
		t.Fatal("second group missing from startpage")
	}

	if status, _ := b.createApp(plexApp(map[string]any{"groupId": second.ID})); status != http.StatusCreated {
		t.Fatalf("create status %d, want 201", status)
	}

	sp := b.startpage()
	if len(sp.Groups) != 2 || sp.Groups[0].ID != first.ID || len(sp.Groups[0].Apps) != 0 || len(sp.Groups[1].Apps) != 1 {
		t.Errorf("groups = %+v, want app only in second group", sp.Groups)
	}
}

func TestCreateAppRejectsInvalidInput(t *testing.T) {
	b, _ := signedIn(t)

	for name, body := range map[string]map[string]any{
		"missing name": plexApp(map[string]any{"name": ""}),
		"missing url":  plexApp(map[string]any{"url": ""}),
	} {
		if status, _ := b.createApp(body); status != http.StatusBadRequest {
			t.Errorf("%s: status %d, want 400", name, status)
		}
	}
	if n := len(b.startpage().Groups[0].Apps); n != 0 {
		t.Errorf("rejected apps were stored: %d", n)
	}
}

func TestUsersNeverSeeOrTouchEachOthersAppsAndGroups(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")

	alice.createApp(plexApp(nil))
	aliceGroup := alice.startpage().Groups[0]

	bobPage := bob.startpage()
	if len(bobPage.Groups) != 1 || bobPage.Groups[0].ID == aliceGroup.ID || len(bobPage.Groups[0].Apps) != 0 {
		t.Errorf("bob sees %+v", bobPage.Groups)
	}
	if status, _ := bob.createApp(plexApp(map[string]any{"groupId": aliceGroup.ID})); status != http.StatusNotFound {
		t.Errorf("creating in another user's group: status %d, want 404", status)
	}
	if n := len(alice.startpage().Groups[0].Apps); n != 1 {
		t.Errorf("alice has %d apps, want 1", n)
	}
}

func signInAs(t *testing.T, ts *httptest.Server, p *oidctest.Provider, sub, name string) *browser {
	t.Helper()
	p.SignInAs(sub, name)
	b := newBrowser(t, ts)
	b.signIn()
	return b
}
