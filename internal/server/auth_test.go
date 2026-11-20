package server_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

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

func (b *browser) logout() (*http.Response, string) {
	b.t.Helper()
	req, _ := http.NewRequest(http.MethodPost, b.app.URL+"/auth/logout", nil)
	for _, c := range b.cookies {
		req.AddCookie(c)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		b.t.Fatal(err)
	}
	defer resp.Body.Close()
	for _, c := range resp.Cookies() {
		b.cookies[c.Name] = c
	}
	var body struct {
		RedirectURL string `json:"redirectUrl"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&body)
	return resp, body.RedirectURL
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

func TestCallbackWithProviderErrorIs400AndCreatesNoSession(t *testing.T) {
	app, dbURL, provider := startWithProvider(t)
	b := newBrowser(t, app)
	login := b.get(app.URL + "/auth/login")
	state := mustParse(t, login.Header.Get("Location")).Query().Get("state")

	resp := b.get(app.URL + "/auth/callback?error=access_denied&state=" + url.QueryEscape(state))

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want 400", resp.StatusCode)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions"); got != 0 {
		t.Errorf("sessions = %d, want 0", got)
	}
	if provider.TokenRequests() != 0 {
		t.Error("code exchange attempted despite provider error")
	}
}

func TestCallbackRejectsNonceMismatch(t *testing.T) {
	app, dbURL, _ := startWithProvider(t)
	b := newBrowser(t, app)
	login := b.get(app.URL + "/auth/login")
	authorize := mustParse(t, login.Header.Get("Location"))
	q := authorize.Query()
	q.Set("nonce", "tampered")
	authorize.RawQuery = q.Encode()
	authorized := b.get(authorize.String())
	callback := mustParse(t, authorized.Header.Get("Location"))

	resp := b.get(app.URL + callback.Path + "?" + callback.RawQuery)

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", resp.StatusCode)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions"); got != 0 {
		t.Errorf("sessions = %d, want 0", got)
	}
	if b.cookies[sessionCookie] != nil && b.cookies[sessionCookie].Value != "" {
		t.Error("session cookie issued")
	}
}

func TestMeIsNotCacheable(t *testing.T) {
	b, _ := signedIn(t)

	req, _ := http.NewRequest(http.MethodGet, b.app.URL+"/api/me", nil)
	req.AddCookie(b.cookies[sessionCookie])
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()

	if got := resp.Header.Get("Cache-Control"); got != "no-store" {
		t.Errorf("Cache-Control = %q, want no-store", got)
	}
}

func mustParse(t *testing.T, raw string) *url.URL {
	t.Helper()
	u, err := url.Parse(raw)
	if err != nil {
		t.Fatal(err)
	}
	return u
}

func (b *browser) post(rawURL string) *http.Response {
	b.t.Helper()
	req, _ := http.NewRequest(http.MethodPost, rawURL, nil)
	for _, c := range b.cookies {
		req.AddCookie(c)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		b.t.Fatal(err)
	}
	resp.Body.Close()
	for _, c := range resp.Cookies() {
		b.cookies[c.Name] = c
	}
	return resp
}

func execSQL(t *testing.T, dbURL, sql string, args ...any) {
	t.Helper()
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(ctx)
	if _, err := conn.Exec(ctx, sql, args...); err != nil {
		t.Fatal(err)
	}
}

func signedIn(t *testing.T) (*browser, string) {
	app, dbURL, provider := startWithProvider(t)
	provider.SignInAs("sub-alice", "Alice")
	b := newBrowser(t, app)
	b.signIn()
	return b, dbURL
}

func TestUsingSessionExtendsExpiry(t *testing.T) {
	b, dbURL := signedIn(t)
	execSQL(t, dbURL, "UPDATE sessions SET expires_at = now() + interval '5 days'")

	if status, _ := b.me(); status != 200 {
		t.Fatalf("status = %d, want 200", status)
	}

	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions WHERE expires_at > now() + interval '29 days'"); got != 1 {
		t.Error("expiry was not extended to ~30 days")
	}
}

func TestSlidingExpiryReissuesCookie(t *testing.T) {
	b, dbURL := signedIn(t)
	execSQL(t, dbURL, "UPDATE sessions SET expires_at = now() + interval '5 days'")
	b.cookies[sessionCookie].Expires = time.Now().Add(5 * 24 * time.Hour)

	b.get(b.app.URL + "/api/me")

	c := b.cookies[sessionCookie]
	if !c.Expires.After(time.Now().Add(29*24*time.Hour)) || !c.HttpOnly || !c.Secure || c.SameSite != http.SameSiteLaxMode {
		t.Errorf("cookie = %+v, want re-issued with ~30 day expiry and original flags", c)
	}
}

func TestFreshSessionIsNotRewritten(t *testing.T) {
	b, dbURL := signedIn(t)
	execSQL(t, dbURL, "UPDATE sessions SET expires_at = now() + interval '30 days' - interval '1 minute'")
	before := queryInt(t, dbURL, "SELECT extract(epoch FROM expires_at)::bigint FROM sessions")

	b.me()

	if after := queryInt(t, dbURL, "SELECT extract(epoch FROM expires_at)::bigint FROM sessions"); after != before {
		t.Errorf("expires_at changed from %d to %d, want untouched", before, after)
	}
}

func TestExpiredSessionIs401(t *testing.T) {
	b, dbURL := signedIn(t)
	execSQL(t, dbURL, "UPDATE sessions SET expires_at = now() - interval '1 second'")

	if status, _ := b.me(); status != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", status)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions WHERE expires_at > now()"); got != 0 {
		t.Error("expired session was revived")
	}
}

func TestRevokedSessionIs401(t *testing.T) {
	b, dbURL := signedIn(t)
	execSQL(t, dbURL, "UPDATE sessions SET revoked_at = now()")

	if status, _ := b.me(); status != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", status)
	}
}

func TestSignOutInvalidatesSessionAndClearsCookie(t *testing.T) {
	b, dbURL := signedIn(t)
	old := b.cookies[sessionCookie].Value

	resp, _ := b.logout()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	if c := b.cookies[sessionCookie]; c == nil || c.MaxAge >= 0 || c.Value != "" {
		t.Errorf("cookie = %+v, want cleared (Max-Age<=0)", c)
	}
	if got := queryInt(t, dbURL, "SELECT count(*) FROM sessions"); got != 0 {
		t.Errorf("sessions = %d, want 0", got)
	}
	b.cookies[sessionCookie] = &http.Cookie{Name: sessionCookie, Value: old}
	if status, _ := b.me(); status != http.StatusUnauthorized {
		t.Errorf("replayed cookie status = %d, want 401", status)
	}
}

func TestSignOutWithoutSessionIsHarmless(t *testing.T) {
	app, _, _ := startWithProvider(t)

	resp, redirect := newBrowser(t, app).logout()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
	if redirect == "" {
		t.Error("want a redirectUrl even without a session")
	}
}

func TestSignOutRedirectsToProviderEndSession(t *testing.T) {
	app, _, provider := startWithProvider(t)
	b := newBrowser(t, app)
	b.signIn()

	_, redirect := b.logout()

	u, err := url.Parse(redirect)
	if err != nil {
		t.Fatal(err)
	}
	if got := u.Scheme + "://" + u.Host + u.Path; got != provider.URL+"/end-session" {
		t.Errorf("redirectUrl = %q, want provider end-session endpoint", redirect)
	}
	q := u.Query()
	if q.Get("post_logout_redirect_uri") != "https://start.example.com/" {
		t.Errorf("post_logout_redirect_uri = %q", q.Get("post_logout_redirect_uri"))
	}
	if q.Get("id_token_hint") == "" {
		t.Error("id_token_hint missing")
	}
}

func TestSignOutRejectsGET(t *testing.T) {
	app, _, _ := startWithProvider(t)

	if resp := newBrowser(t, app).get(app.URL + "/auth/logout"); resp.StatusCode == http.StatusNoContent {
		t.Error("GET must not sign out")
	}
}
