package server_test

import (
	"net/http"
	"testing"
)

const duckDuckGo = "https://duckduckgo.com/?q="

func (b *browser) patchSettings(body map[string]any) int {
	b.t.Helper()
	resp, _ := b.do(http.MethodPatch, "/api/settings", body)
	return resp.StatusCode
}

func TestNewUserGetsDefaultSettings(t *testing.T) {
	b, _ := signedIn(t)

	s := b.startpage().Settings
	if s.SearchEngine != duckDuckGo || s.ShowNameInGreeting {
		t.Errorf("settings = %+v, want DuckDuckGo and name hidden", s)
	}
}

func TestPartialUpdateChangesOnlySuppliedFieldsAndShowsInStartpage(t *testing.T) {
	b, _ := signedIn(t)

	if status := b.patchSettings(map[string]any{"showNameInGreeting": true}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}
	if s := b.startpage().Settings; s.SearchEngine != duckDuckGo || !s.ShowNameInGreeting {
		t.Errorf("after name toggle: %+v", s)
	}

	if status := b.patchSettings(map[string]any{"searchEngine": "https://www.google.com/search?q="}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}
	if s := b.startpage().Settings; s.SearchEngine != "https://www.google.com/search?q=" || !s.ShowNameInGreeting {
		t.Errorf("after engine change: %+v", s)
	}
}

func TestInvalidSearchEngineIsRejectedAndChangesNothing(t *testing.T) {
	b, _ := signedIn(t)
	b.patchSettings(map[string]any{"searchEngine": "https://www.bing.com/search?q="})

	for name, body := range map[string]map[string]any{
		"not a url":        {"searchEngine": "not a url"},
		"ftp scheme":       {"searchEngine": "ftp://example.com/?q="},
		"no scheme":        {"searchEngine": "duckduckgo.com/?q="},
		"empty":            {"searchEngine": ""},
		"no host":          {"searchEngine": "https://"},
		"with other field": {"searchEngine": "javascript:alert(1)", "showNameInGreeting": true},
	} {
		if status := b.patchSettings(body); status != http.StatusBadRequest {
			t.Errorf("%s: status %d, want 400", name, status)
		}
	}
	if s := b.startpage().Settings; s.SearchEngine != "https://www.bing.com/search?q=" || s.ShowNameInGreeting {
		t.Errorf("rejected updates changed settings: %+v", s)
	}
}

func TestEmptySettingsUpdateIsRejected(t *testing.T) {
	b, _ := signedIn(t)

	if status := b.patchSettings(map[string]any{}); status != http.StatusBadRequest {
		t.Errorf("status %d, want 400", status)
	}
}

func TestSettingsRequireSignInAndAreIsolatedBetweenUsers(t *testing.T) {
	ts, _, provider := startApp(t)
	if status := newBrowser(t, ts).patchSettings(map[string]any{"showNameInGreeting": true}); status != http.StatusUnauthorized {
		t.Errorf("unauthenticated: status %d, want 401", status)
	}
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")

	alice.patchSettings(map[string]any{"searchEngine": "https://kagi.com/search?q=", "showNameInGreeting": true})

	if s := bob.startpage().Settings; s.SearchEngine != duckDuckGo || s.ShowNameInGreeting {
		t.Errorf("bob sees alice's settings: %+v", s)
	}
	if s := alice.startpage().Settings; s.SearchEngine != "https://kagi.com/search?q=" || !s.ShowNameInGreeting {
		t.Errorf("alice settings = %+v", s)
	}
}
