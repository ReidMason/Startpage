package server_test

import (
	"net/http"
	"strings"
	"testing"
)

const (
	defaultEngine      = "https://www.google.com/search?q="
	defaultPlaceholder = "Search..."
)

func (b *browser) patchSettings(body map[string]any) int {
	b.t.Helper()
	resp, _ := b.do(http.MethodPatch, "/api/settings", body)
	return resp.StatusCode
}

func TestNewUserGetsDefaultSettings(t *testing.T) {
	b, _ := signedIn(t)

	s := b.startpage().Settings
	if s.SearchEngine != defaultEngine || s.ShowNameInGreeting || s.SearchPlaceholder != defaultPlaceholder {
		t.Errorf("settings = %+v, want Google, name hidden and default placeholder", s)
	}
}

func TestPartialUpdateChangesOnlySuppliedFieldsAndShowsInStartpage(t *testing.T) {
	b, _ := signedIn(t)

	if status := b.patchSettings(map[string]any{"showNameInGreeting": true}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}
	if s := b.startpage().Settings; s.SearchEngine != defaultEngine || !s.ShowNameInGreeting {
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

	if s := bob.startpage().Settings; s.SearchEngine != defaultEngine || s.ShowNameInGreeting {
		t.Errorf("bob sees alice's settings: %+v", s)
	}
	if s := alice.startpage().Settings; s.SearchEngine != "https://kagi.com/search?q=" || !s.ShowNameInGreeting {
		t.Errorf("alice settings = %+v", s)
	}
}

func TestSearchPlaceholderIsTrimmedAndEmptyResetsToDefault(t *testing.T) {
	b, _ := signedIn(t)

	if status := b.patchSettings(map[string]any{"searchPlaceholder": "  Find anything  "}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}
	if s := b.startpage().Settings; s.SearchPlaceholder != "Find anything" || s.SearchEngine != defaultEngine {
		t.Errorf("after set: %+v", s)
	}

	if status := b.patchSettings(map[string]any{"searchPlaceholder": "   "}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}
	if s := b.startpage().Settings; s.SearchPlaceholder != defaultPlaceholder {
		t.Errorf("after clearing: %+v, want default placeholder", s)
	}
}

func TestOverlongSearchPlaceholderIsRejectedAndChangesNothing(t *testing.T) {
	b, _ := signedIn(t)
	b.patchSettings(map[string]any{"searchPlaceholder": "Mine"})

	if status := b.patchSettings(map[string]any{"searchPlaceholder": strings.Repeat("a", 41)}); status != http.StatusBadRequest {
		t.Errorf("41 chars: status %d, want 400", status)
	}
	if status := b.patchSettings(map[string]any{"searchPlaceholder": strings.Repeat("a", 40)}); status != http.StatusNoContent {
		t.Errorf("40 chars: status %d, want 204", status)
	}
	if status := b.patchSettings(map[string]any{"searchPlaceholder": strings.Repeat("a", 41), "showNameInGreeting": true}); status != http.StatusBadRequest {
		t.Errorf("with other field: status %d, want 400", status)
	}
	if s := b.startpage().Settings; s.ShowNameInGreeting {
		t.Errorf("rejected update changed settings: %+v", s)
	}
}
