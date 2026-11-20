package server_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/jackc/pgx/v5"

	"github.com/ReidMason/startpage/internal/oidctest"
)

const sessionCookie = "startpage_session"

type browser struct {
	t       *testing.T
	app     *httptest.Server
	cookies map[string]*http.Cookie
}

func newBrowser(t *testing.T, app *httptest.Server) *browser {
	return &browser{t: t, app: app, cookies: map[string]*http.Cookie{}}
}

func (b *browser) get(rawURL string) *http.Response {
	b.t.Helper()
	req, _ := http.NewRequest(http.MethodGet, rawURL, nil)
	for _, c := range b.cookies {
		req.AddCookie(c)
	}
	client := &http.Client{CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	resp, err := client.Do(req)
	if err != nil {
		b.t.Fatal(err)
	}
	resp.Body.Close()
	for _, c := range resp.Cookies() {
		b.cookies[c.Name] = c
	}
	return resp
}

func (b *browser) signIn() *http.Response {
	b.t.Helper()
	login := b.get(b.app.URL + "/auth/login")
	authorized := b.get(login.Header.Get("Location"))
	callback, err := url.Parse(authorized.Header.Get("Location"))
	if err != nil {
		b.t.Fatal(err)
	}
	return b.get(b.app.URL + callback.Path + "?" + callback.RawQuery)
}

func (b *browser) me() (int, string) {
	b.t.Helper()
	req, _ := http.NewRequest(http.MethodGet, b.app.URL+"/api/me", nil)
	for _, c := range b.cookies {
		req.AddCookie(c)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		b.t.Fatal(err)
	}
	defer resp.Body.Close()
	var body struct {
		DisplayName string `json:"displayName"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&body)
	return resp.StatusCode, body.DisplayName
}

func startWithProvider(t *testing.T) (*httptest.Server, string, *oidctest.Provider) {
	return startApp(t)
}

func queryInt(t *testing.T, dbURL, sql string, args ...any) int {
	t.Helper()
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(ctx)
	var n int
	if err := conn.QueryRow(ctx, sql, args...).Scan(&n); err != nil {
		t.Fatal(err)
	}
	return n
}

func TestLoginRedirectsToProvider(t *testing.T) {
	app, _, provider := startWithProvider(t)

	resp := newBrowser(t, app).get(app.URL + "/auth/login")

	if resp.StatusCode != http.StatusFound {
		t.Fatalf("status = %d, want 302", resp.StatusCode)
	}
	loc, err := url.Parse(resp.Header.Get("Location"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.HasPrefix(loc.String(), provider.URL+"/authorize?") {
		t.Fatalf("Location = %q, want provider authorize endpoint", loc)
	}
	q := loc.Query()
	if q.Get("client_id") != "startpage" || q.Get("response_type") != "code" ||
		q.Get("redirect_uri") != "https://start.example.com/auth/callback" ||
		q.Get("state") == "" || q.Get("nonce") == "" {
		t.Errorf("unexpected authorize query %v", q)
	}
}

func TestCallbackCreatesUserAndSession(t *testing.T) {
	app, dbURL, provider := startWithProvider(t)
	provider.SignInAs("sub-alice", "Alice")
	b := newBrowser(t, app)

	resp := b.signIn()

	if resp.StatusCode != http.StatusFound || resp.Header.Get("Location") != "/" {
		t.Fatalf("callback = %d -> %q, want 302 -> /", resp.StatusCode, resp.Header.Get("Location"))
	}
	c := b.cookies[sessionCookie]
	if c == nil || !c.HttpOnly || !c.Secure || c.SameSite != http.SameSiteLaxMode {
		t.Fatalf("session cookie = %+v, want HttpOnly Secure SameSite=Lax", c)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM users WHERE oidc_subject = 'sub-alice' AND display_name = 'Alice'"); got != 1 {
		t.Errorf("users = %d, want 1", got)
	}
	if status, name := b.me(); status != 200 || name != "Alice" {
		t.Errorf("/api/me = %d %q, want 200 Alice", status, name)
	}
}

func TestSecondLoginReusesUser(t *testing.T) {
	app, dbURL, provider := startWithProvider(t)
	provider.SignInAs("sub-alice", "Alice")
	newBrowser(t, app).signIn()

	provider.SignInAs("sub-alice", "Alice Renamed")
	b := newBrowser(t, app)
	b.signIn()

	if got := queryInt(t, dbURL, "SELECT count(*) FROM users"); got != 1 {
		t.Errorf("users = %d, want 1", got)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions"); got != 2 {
		t.Errorf("sessions = %d, want 2", got)
	}
	if _, name := b.me(); name != "Alice Renamed" {
		t.Errorf("display name = %q, want Alice Renamed", name)
	}
}

func TestMeWithoutSessionIs401(t *testing.T) {
	app, _, _ := startWithProvider(t)

	if status, _ := newBrowser(t, app).me(); status != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", status)
	}
}

func TestMeWithUnknownSessionIs401(t *testing.T) {
	app, _, _ := startWithProvider(t)
	b := newBrowser(t, app)
	b.cookies[sessionCookie] = &http.Cookie{Name: sessionCookie, Value: "not-a-real-session"}

	if status, _ := b.me(); status != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", status)
	}
}

func TestSessionIDIsStoredOnlyAsHash(t *testing.T) {
	app, dbURL, _ := startWithProvider(t)
	b := newBrowser(t, app)
	b.signIn()

	id := b.cookies[sessionCookie].Value
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions WHERE position($1::bytea in id_hash) > 0 OR id_hash = $1::bytea", []byte(id)); got != 0 {
		t.Error("raw session id found in sessions table")
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions WHERE id_hash = sha256($1::bytea) AND expires_at > now() + interval '29 days' AND expires_at <= now() + interval '30 days'", []byte(id)); got != 1 {
		t.Errorf("sessions with sha256(id) hash and ~30 day expiry = %d, want 1", got)
	}
}

func TestCallbackRejectsBadState(t *testing.T) {
	app, dbURL, _ := startWithProvider(t)
	b := newBrowser(t, app)
	b.get(app.URL + "/auth/login")

	resp := b.get(app.URL + "/auth/callback?code=x&state=forged")

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want 400", resp.StatusCode)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions"); got != 0 {
		t.Errorf("sessions = %d, want 0", got)
	}
}
