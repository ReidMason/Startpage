package server_test

import (
	"encoding/json"
	"net/http"
	"reflect"
	"testing"
)

type themeJSON struct {
	ID                  int64  `json:"id"`
	Name                string `json:"name"`
	Background          string `json:"background"`
	Foreground          string `json:"foreground"`
	Card                string `json:"card"`
	CardForeground      string `json:"cardForeground"`
	Primary             string `json:"primary"`
	PrimaryForeground   string `json:"primaryForeground"`
	Secondary           string `json:"secondary"`
	SecondaryForeground string `json:"secondaryForeground"`
	Muted               string `json:"muted"`
	MutedForeground     string `json:"mutedForeground"`
	Accent              string `json:"accent"`
	AccentForeground    string `json:"accentForeground"`
	Destructive         string `json:"destructive"`
	Border              string `json:"border"`
	Input               string `json:"input"`
	Ring                string `json:"ring"`
}

func (b *browser) themes() []themeJSON {
	b.t.Helper()
	resp, data := b.do(http.MethodGet, "/api/themes", nil)
	if resp.StatusCode != http.StatusOK {
		b.t.Fatalf("GET /api/themes: status %d: %s", resp.StatusCode, data)
	}
	var out []themeJSON
	if err := json.Unmarshal(data, &out); err != nil {
		b.t.Fatal(err)
	}
	return out
}

func themeNames(themes []themeJSON) []string {
	names := make([]string, len(themes))
	for i, th := range themes {
		names[i] = th.Name
	}
	return names
}

func themeID(t *testing.T, themes []themeJSON, name string) int64 {
	t.Helper()
	for _, th := range themes {
		if th.Name == name {
			return th.ID
		}
	}
	t.Fatalf("theme %q not listed", name)
	return 0
}

func setThemeDeleted(t *testing.T, dbURL string, id int64, deleted bool) {
	t.Helper()
	deletedAt := "NULL"
	if deleted {
		deletedAt = "now()"
	}
	execSQL(t, dbURL, "UPDATE themes SET deleted_at = "+deletedAt+" WHERE id = $1", id)
}

func expectTheme(t *testing.T, b *browser, want *int64) {
	t.Helper()
	got := b.startpage().Settings.ThemeID
	switch {
	case want == nil && got != nil:
		t.Errorf("themeId = %d, want null", *got)
	case want != nil && (got == nil || *got != *want):
		t.Errorf("themeId = %v, want %d", got, *want)
	}
}

func idOf(id int64) *int64 { return &id }

func TestThemesListsSeededPresetsWithAllColours(t *testing.T) {
	b, _ := signedIn(t)

	themes := b.themes()

	if got, want := themeNames(themes), []string{"light", "dark", "catppuccin-mocha", "tokyo-night"}; !reflect.DeepEqual(got, want) {
		t.Fatalf("names = %v, want %v", got, want)
	}
	if themes[0].ID != 1 || themes[1].ID != 2 {
		t.Errorf("light and dark ids = %d and %d, want 1 and 2", themes[0].ID, themes[1].ID)
	}
	for _, th := range themes {
		v := reflect.ValueOf(th)
		for i := 2; i < v.NumField(); i++ {
			if v.Field(i).String() == "" {
				t.Errorf("%s: %s is empty", th.Name, v.Type().Field(i).Name)
			}
		}
	}
}

func TestThemesRequireSignIn(t *testing.T) {
	ts, _, _ := startApp(t)

	resp, _ := newBrowser(t, ts).do(http.MethodGet, "/api/themes", nil)

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status %d, want 401", resp.StatusCode)
	}
}

func TestThemesOmitsSoftDeletedPresets(t *testing.T) {
	b, dbURL := signedIn(t)
	tokyo := themeID(t, b.themes(), "tokyo-night")

	setThemeDeleted(t, dbURL, tokyo, true)

	if got, want := themeNames(b.themes()), []string{"light", "dark", "catppuccin-mocha"}; !reflect.DeepEqual(got, want) {
		t.Errorf("names = %v, want %v", got, want)
	}
}

func TestNewUserIsOnSystemTheme(t *testing.T) {
	b, _ := signedIn(t)

	expectTheme(t, b, nil)
}

func TestSavingThemePersistsAndNullReturnsToSystem(t *testing.T) {
	b, _ := signedIn(t)
	catppuccin := themeID(t, b.themes(), "catppuccin-mocha")

	if status := b.patchSettings(map[string]any{"themeId": catppuccin}); status != http.StatusNoContent {
		t.Fatalf("save: status %d, want 204", status)
	}
	expectTheme(t, b, idOf(catppuccin))

	if status := b.patchSettings(map[string]any{"themeId": nil}); status != http.StatusNoContent {
		t.Fatalf("clear: status %d, want 204", status)
	}
	expectTheme(t, b, nil)
}

func TestSavingOtherSettingsKeepsTheme(t *testing.T) {
	b, _ := signedIn(t)
	b.patchSettings(map[string]any{"themeId": 2})

	b.patchSettings(map[string]any{"showNameInGreeting": true})

	expectTheme(t, b, idOf(2))
}

func TestSavingUnknownOrSoftDeletedThemeIsRejectedAndChangesNothing(t *testing.T) {
	b, dbURL := signedIn(t)
	b.patchSettings(map[string]any{"themeId": 1})
	setThemeDeleted(t, dbURL, 4, true)

	for name, body := range map[string]map[string]any{
		"unknown":          {"themeId": 9999},
		"soft-deleted":     {"themeId": 4},
		"with other field": {"themeId": 9999, "showNameInGreeting": true},
	} {
		if status := b.patchSettings(body); status != http.StatusBadRequest {
			t.Errorf("%s: status %d, want 400", name, status)
		}
	}
	expectTheme(t, b, idOf(1))
	if b.startpage().Settings.ShowNameInGreeting {
		t.Error("rejected update changed other settings")
	}
}

func TestSoftDeletedChosenThemeFallsBackToSystemAndRestoreBringsChoiceBack(t *testing.T) {
	b, dbURL := signedIn(t)
	b.patchSettings(map[string]any{"themeId": 3})

	setThemeDeleted(t, dbURL, 3, true)
	expectTheme(t, b, nil)

	setThemeDeleted(t, dbURL, 3, false)
	expectTheme(t, b, idOf(3))
}

func TestThemeChoiceIsIndependentBetweenUsers(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")

	alice.patchSettings(map[string]any{"themeId": 2})

	expectTheme(t, bob, nil)
	expectTheme(t, alice, idOf(2))
}
