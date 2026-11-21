package server_test

import (
	"bytes"
	"encoding/json"
	"fmt"
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

func (b *browser) updateApp(id int64, body map[string]any) (int, appJSON) {
	b.t.Helper()
	resp, data := b.do(http.MethodPut, fmt.Sprintf("/api/apps/%d", id), body)
	var updated appJSON
	_ = json.Unmarshal(data, &updated)
	return resp.StatusCode, updated
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

func TestUpdateAppChangesFieldsKeepingGroupAndPosition(t *testing.T) {
	b, _ := signedIn(t)
	_, plex := b.createApp(plexApp(nil))
	b.createApp(plexApp(map[string]any{"name": "Sonarr"}))

	status, updated := b.updateApp(plex.ID, map[string]any{"name": "Jellyfin", "url": "jf.example.com", "iconName": "simple-icons:jellyfin", "iconSvg": "<g/>"})
	if status != http.StatusOK {
		t.Fatalf("update status %d, want 200", status)
	}
	if updated.ID != plex.ID || updated.Name != "Jellyfin" || updated.URL != "jf.example.com" || updated.IconName != "simple-icons:jellyfin" || updated.IconSvg != "<g/>" {
		t.Errorf("updated = %+v", updated)
	}
	apps := b.startpage().Groups[0].Apps
	if len(apps) != 2 || apps[0].ID != plex.ID || apps[0].Name != "Jellyfin" || apps[1].Name != "Sonarr" {
		t.Errorf("apps = %+v, want edited app still first", apps)
	}
}

func TestUpdateAppRejectsInvalidInputAndUnknownApp(t *testing.T) {
	b, _ := signedIn(t)
	_, plex := b.createApp(plexApp(nil))

	if status, _ := b.updateApp(plex.ID, plexApp(map[string]any{"name": " "})); status != http.StatusBadRequest {
		t.Errorf("blank name: status %d, want 400", status)
	}
	if status, _ := b.updateApp(plex.ID, plexApp(map[string]any{"url": ""})); status != http.StatusBadRequest {
		t.Errorf("blank url: status %d, want 400", status)
	}
	if status, _ := b.updateApp(plex.ID+999, plexApp(nil)); status != http.StatusNotFound {
		t.Errorf("unknown app: status %d, want 404", status)
	}
	if got := b.startpage().Groups[0].Apps[0].Name; got != "Plex" {
		t.Errorf("rejected update changed app: %q", got)
	}
}

func TestUpdateAppRequiresSignIn(t *testing.T) {
	ts, _ := startServer(t)
	b := newBrowser(t, ts)
	if resp, _ := b.do(http.MethodPut, "/api/apps/1", plexApp(nil)); resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status %d, want 401", resp.StatusCode)
	}
}

func TestUsersCannotUpdateEachOthersApps(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")
	_, plex := alice.createApp(plexApp(nil))

	if status, _ := bob.updateApp(plex.ID, plexApp(map[string]any{"name": "Hacked"})); status != http.StatusNotFound {
		t.Errorf("status %d, want 404", status)
	}
	if got := alice.startpage().Groups[0].Apps[0].Name; got != "Plex" {
		t.Errorf("alice's app changed to %q", got)
	}
}

func (b *browser) deleteApp(id int64) int {
	b.t.Helper()
	resp, _ := b.do(http.MethodDelete, fmt.Sprintf("/api/apps/%d", id), nil)
	return resp.StatusCode
}

func (b *browser) restoreApp(id int64) (int, appJSON) {
	b.t.Helper()
	resp, data := b.do(http.MethodPost, fmt.Sprintf("/api/apps/%d/restore", id), nil)
	var restored appJSON
	_ = json.Unmarshal(data, &restored)
	return resp.StatusCode, restored
}

func appNames(apps []appJSON) []string {
	names := []string{}
	for _, a := range apps {
		names = append(names, a.Name)
	}
	return names
}

func TestDeletedAppDisappearsFromStartpage(t *testing.T) {
	b, _ := signedIn(t)
	_, plex := b.createApp(plexApp(nil))
	b.createApp(plexApp(map[string]any{"name": "Sonarr"}))

	if status := b.deleteApp(plex.ID); status != http.StatusNoContent {
		t.Fatalf("delete status %d, want 204", status)
	}
	if got := appNames(b.startpage().Groups[0].Apps); len(got) != 1 || got[0] != "Sonarr" {
		t.Errorf("apps = %v, want [Sonarr]", got)
	}
	if status := b.deleteApp(plex.ID); status != http.StatusNotFound {
		t.Errorf("deleting twice: status %d, want 404", status)
	}
	if status, _ := b.updateApp(plex.ID, plexApp(nil)); status != http.StatusNotFound {
		t.Errorf("updating deleted app: status %d, want 404", status)
	}
}

func TestRestoreReturnsAppToOriginalPositionShiftingSiblings(t *testing.T) {
	b, _ := signedIn(t)
	b.createApp(plexApp(map[string]any{"name": "A"}))
	_, bApp := b.createApp(plexApp(map[string]any{"name": "B"}))
	b.createApp(plexApp(map[string]any{"name": "C"}))

	b.deleteApp(bApp.ID)
	b.createApp(plexApp(map[string]any{"name": "D"}))
	status, restored := b.restoreApp(bApp.ID)
	if status != http.StatusOK || restored.ID != bApp.ID || restored.Name != "B" {
		t.Fatalf("restore = %d %+v", status, restored)
	}

	got := appNames(b.startpage().Groups[0].Apps)
	if want := []string{"A", "B", "C", "D"}; fmt.Sprint(got) != fmt.Sprint(want) {
		t.Errorf("apps = %v, want %v", got, want)
	}
	if status, _ := b.restoreApp(bApp.ID); status != http.StatusNotFound {
		t.Errorf("restoring a live app: status %d, want 404", status)
	}
}

func TestRestoreReturnsAppToOriginalGroup(t *testing.T) {
	b, dbURL := signedIn(t)
	first := b.startpage().Groups[0]
	execSQL(t, dbURL, "INSERT INTO groups (user_id, name, position) SELECT user_id, 'Media', 1 FROM groups WHERE id = $1", first.ID)
	media := b.startpage().Groups[1]
	_, plex := b.createApp(plexApp(map[string]any{"groupId": media.ID}))

	b.deleteApp(plex.ID)
	b.restoreApp(plex.ID)

	sp := b.startpage()
	if len(sp.Groups[0].Apps) != 0 || len(sp.Groups[1].Apps) != 1 || sp.Groups[1].Apps[0].ID != plex.ID {
		t.Errorf("groups = %+v, want app back in Media", sp.Groups)
	}
}

func TestDeleteAndRestoreRequireSignIn(t *testing.T) {
	ts, _ := startServer(t)
	b := newBrowser(t, ts)
	if resp, _ := b.do(http.MethodDelete, "/api/apps/1", nil); resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("delete: status %d, want 401", resp.StatusCode)
	}
	if resp, _ := b.do(http.MethodPost, "/api/apps/1/restore", nil); resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("restore: status %d, want 401", resp.StatusCode)
	}
}

func TestUsersCannotDeleteOrRestoreEachOthersApps(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")
	_, plex := alice.createApp(plexApp(nil))

	if status := bob.deleteApp(plex.ID); status != http.StatusNotFound {
		t.Errorf("delete: status %d, want 404", status)
	}
	if n := len(alice.startpage().Groups[0].Apps); n != 1 {
		t.Fatalf("alice has %d apps, want 1", n)
	}
	alice.deleteApp(plex.ID)
	if status, _ := bob.restoreApp(plex.ID); status != http.StatusNotFound {
		t.Errorf("restore: status %d, want 404", status)
	}
	if n := len(alice.startpage().Groups[0].Apps); n != 0 {
		t.Errorf("bob restored alice's app")
	}
}

func TestAppURLsMustBeHTTPOrSchemeless(t *testing.T) {
	b, _ := signedIn(t)
	_, plex := b.createApp(plexApp(nil))

	for _, url := range []string{"javascript://%0aalert(1)", "JavaScript://x", "data://text/html,hi", "ftp://files.example.com", "file:///etc/passwd"} {
		if status, _ := b.createApp(plexApp(map[string]any{"url": url})); status != http.StatusBadRequest {
			t.Errorf("create %q: status %d, want 400", url, status)
		}
		if status, _ := b.updateApp(plex.ID, plexApp(map[string]any{"url": url})); status != http.StatusBadRequest {
			t.Errorf("update %q: status %d, want 400", url, status)
		}
	}
	for _, url := range []string{"http://plex.local:32400", "HTTPS://plex.example.com/web", "plex.local:32400", "plex.example.com"} {
		if status, _ := b.createApp(plexApp(map[string]any{"url": url})); status != http.StatusCreated {
			t.Errorf("create %q: status %d, want 201", url, status)
		}
	}
	if got := b.startpage().Groups[0].Apps[0].URL; got != "plex.example.com" {
		t.Errorf("rejected update changed url: %q", got)
	}
}

func TestRestoreAfterReorderLandsAtClosestSlotWithDenseOrder(t *testing.T) {
	b, dbURL := signedIn(t)
	groupID := b.startpage().Groups[0].ID
	var ids []int64
	for _, name := range []string{"A", "B", "C", "D"} {
		_, a := b.createApp(plexApp(map[string]any{"name": name}))
		ids = append(ids, a.ID)
	}
	a, bb, c, d := ids[0], ids[1], ids[2], ids[3]
	assertDense := func(live int) {
		t.Helper()
		distinct := queryInt(t, dbURL, "SELECT count(DISTINCT position) FROM apps WHERE deleted_at IS NULL")
		maxPos := queryInt(t, dbURL, "SELECT max(position) FROM apps WHERE deleted_at IS NULL")
		if distinct != live || maxPos != live-1 {
			t.Errorf("positions not dense: distinct=%d max=%d, want %d live", distinct, maxPos, live)
		}
	}

	b.deleteApp(c)
	b.deleteApp(d)
	if status := b.reorder(groupArrangement{groupID, []int64{bb, a}}); status != http.StatusNoContent {
		t.Fatalf("reorder status %d", status)
	}
	b.restoreApp(d)
	if got := appNames(b.startpage().Groups[0].Apps); fmt.Sprint(got) != fmt.Sprint([]string{"B", "A", "D"}) {
		t.Errorf("stale position beyond the end: apps = %v, want [B A D]", got)
	}
	assertDense(3)

	b.deleteApp(a)
	if status := b.reorder(groupArrangement{groupID, []int64{d, bb}}); status != http.StatusNoContent {
		t.Fatalf("reorder status %d", status)
	}
	b.restoreApp(a)
	if got := appNames(b.startpage().Groups[0].Apps); fmt.Sprint(got) != fmt.Sprint([]string{"D", "A", "B"}) {
		t.Errorf("tied position: apps = %v, want [D A B]", got)
	}
	assertDense(3)
}
