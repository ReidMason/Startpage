package server

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

type startpage struct {
	auth *auth
	pool *pgxpool.Pool
}

type appResponse struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	URL      string `json:"url"`
	IconName string `json:"iconName"`
	IconSvg  string `json:"iconSvg"`
}

type groupResponse struct {
	ID        int64         `json:"id"`
	Name      string        `json:"name"`
	Style     string        `json:"style"`
	Collapsed bool          `json:"collapsed"`
	Apps      []appResponse `json:"apps"`
}

type settingsResponse struct {
	SearchEngine       string `json:"searchEngine"`
	ShowNameInGreeting bool   `json:"showNameInGreeting"`
	SearchPlaceholder  string `json:"searchPlaceholder"`
	ThemeID            *int64 `json:"themeId"`
}

type themeResponse struct {
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

type optionalID struct {
	Set   bool
	Value *int64
}

func (o *optionalID) UnmarshalJSON(data []byte) error {
	o.Set = true
	return json.Unmarshal(data, &o.Value)
}

func (s *startpage) register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/startpage", s.authed(s.get))
	mux.HandleFunc("PUT /api/startpage/arrangement", s.authed(s.arrange))
	mux.HandleFunc("POST /api/apps", s.authed(s.createApp))
	mux.HandleFunc("PUT /api/apps/{id}", s.authed(s.updateApp))
	mux.HandleFunc("DELETE /api/apps/{id}", s.authed(s.deleteApp))
	mux.HandleFunc("POST /api/apps/{id}/restore", s.authed(s.restoreApp))
	mux.HandleFunc("POST /api/groups", s.authed(s.createGroup))
	mux.HandleFunc("PATCH /api/groups/{id}", s.authed(s.updateGroup))
	mux.HandleFunc("PATCH /api/settings", s.authed(s.updateSettings))
	mux.HandleFunc("GET /api/themes", s.authed(s.listThemes))
}

func (s *startpage) listThemes(w http.ResponseWriter, r *http.Request, _ int64) {
	rows, err := s.auth.queries.ListLiveThemes(r.Context())
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	out := make([]themeResponse, len(rows))
	for i, t := range rows {
		out[i] = themeResponse(t)
	}
	writeJSON(w, http.StatusOK, out)
}

func (s *startpage) updateSettings(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		SearchEngine       *string    `json:"searchEngine"`
		ShowNameInGreeting *bool      `json:"showNameInGreeting"`
		SearchPlaceholder  *string    `json:"searchPlaceholder"`
		ThemeID            optionalID `json:"themeId"`
	}
	if !decodeJSON(w, r, &in) {
		return
	}
	if in.SearchEngine == nil && in.ShowNameInGreeting == nil && in.SearchPlaceholder == nil && !in.ThemeID.Set {
		http.Error(w, "at least one setting is required", http.StatusBadRequest)
		return
	}
	params := dbgen.UpdateSettingsParams{UserID: userID}
	if in.SearchEngine != nil {
		address := strings.TrimSpace(*in.SearchEngine)
		if !validSearchEngine(address) {
			http.Error(w, "searchEngine must be an http or https URL", http.StatusBadRequest)
			return
		}
		params.SearchEngine = pgtype.Text{String: address, Valid: true}
	}
	if in.SearchPlaceholder != nil {
		placeholder := strings.TrimSpace(*in.SearchPlaceholder)
		if utf8.RuneCountInString(placeholder) > maxSearchPlaceholderLength {
			http.Error(w, "searchPlaceholder must be at most 40 characters", http.StatusBadRequest)
			return
		}
		if placeholder == "" {
			placeholder = defaultSearchPlaceholder
		}
		params.SearchPlaceholder = pgtype.Text{String: placeholder, Valid: true}
	}
	if in.ThemeID.Set {
		params.SetThemeID = true
		if in.ThemeID.Value != nil {
			live, err := s.auth.queries.ThemeIsLive(r.Context(), *in.ThemeID.Value)
			if err != nil {
				s.auth.internalError(w, err)
				return
			}
			if !live {
				http.Error(w, "themeId must be an existing theme", http.StatusBadRequest)
				return
			}
			params.ThemeID = pgtype.Int8{Int64: *in.ThemeID.Value, Valid: true}
		}
	}
	if in.ShowNameInGreeting != nil {
		params.ShowNameInGreeting = pgtype.Bool{Bool: *in.ShowNameInGreeting, Valid: true}
	}
	if err := s.auth.queries.UpdateSettings(r.Context(), params); err != nil {
		s.auth.internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

const (
	defaultSearchPlaceholder   = "Search..."
	maxSearchPlaceholderLength = 40
)

func themeID(id pgtype.Int8) *int64 {
	if !id.Valid {
		return nil
	}
	return &id.Int64
}

func validSearchEngine(address string) bool {
	u, err := url.Parse(address)
	return err == nil && (u.Scheme == "http" || u.Scheme == "https") && u.Host != ""
}

func (s *startpage) authed(h func(http.ResponseWriter, *http.Request, int64)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := s.auth.currentUser(r.Context(), r)
		if errors.Is(err, errUnauthenticated) {
			http.Error(w, "unauthenticated", http.StatusUnauthorized)
			return
		}
		if err != nil {
			s.auth.internalError(w, err)
			return
		}
		h(w, r, user.ID)
	}
}

func (s *startpage) get(w http.ResponseWriter, r *http.Request, userID int64) {
	if err := s.ensureFirstGroup(r, userID); err != nil {
		s.auth.internalError(w, err)
		return
	}
	q := s.auth.queries
	groups, err := q.ListGroups(r.Context(), userID)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	apps, err := q.ListLiveApps(r.Context(), userID)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	out := make([]groupResponse, len(groups))
	index := make(map[int64]int, len(groups))
	for i, g := range groups {
		out[i] = groupResponse{ID: g.ID, Name: g.Name, Style: g.Style, Collapsed: g.Collapsed, Apps: []appResponse{}}
		index[g.ID] = i
	}
	for _, a := range apps {
		i := index[a.GroupID]
		out[i].Apps = append(out[i].Apps, appResponse{ID: a.ID, Name: a.Name, URL: a.Url, IconName: a.IconName, IconSvg: a.IconSvg})
	}
	settings, err := q.GetSettings(r.Context(), userID)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"groups": out, "settings": settingsResponse{
		SearchEngine: settings.SearchEngine, ShowNameInGreeting: settings.ShowNameInGreeting,
		SearchPlaceholder: settings.SearchPlaceholder, ThemeID: themeID(settings.ThemeID),
	}})
}

// ensureFirstGroup lazily creates the first Group; the user row lock stops concurrent first requests creating two.
func (s *startpage) ensureFirstGroup(r *http.Request, userID int64) error {
	ctx := r.Context()
	return s.inTx(ctx, func(q *dbgen.Queries) error {
		if err := q.LockUser(ctx, userID); err != nil {
			return err
		}
		return q.CreateFirstGroupIfNone(ctx, userID)
	})
}

func (s *startpage) createApp(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		GroupID  *int64 `json:"groupId"`
		Name     string `json:"name"`
		URL      string `json:"url"`
		IconName string `json:"iconName"`
		IconSvg  string `json:"iconSvg"`
	}
	if !decodeJSON(w, r, &in) {
		return
	}
	in.Name, in.URL = strings.TrimSpace(in.Name), strings.TrimSpace(in.URL)
	if msg := validAppFields(in.Name, in.URL); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	groupID := int64(0)
	if in.GroupID != nil {
		groupID = *in.GroupID
	} else {
		if err := s.ensureFirstGroup(r, userID); err != nil {
			s.auth.internalError(w, err)
			return
		}
		first, err := s.auth.queries.FirstGroupID(r.Context(), userID)
		if err != nil {
			s.auth.internalError(w, err)
			return
		}
		groupID = first
	}
	created, err := s.auth.queries.CreateApp(r.Context(), dbgen.CreateAppParams{
		Name: in.Name, Url: in.URL, IconName: in.IconName, IconSvg: in.IconSvg, GroupID: groupID, UserID: userID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		http.Error(w, "group not found", http.StatusNotFound)
		return
	}
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, appResponse{ID: created.ID, Name: created.Name, URL: created.Url, IconName: created.IconName, IconSvg: created.IconSvg})
}

func (s *startpage) updateApp(w http.ResponseWriter, r *http.Request, userID int64) {
	id, ok := pathID(w, r, http.StatusNotFound, "app not found")
	if !ok {
		return
	}
	var in struct {
		Name     string `json:"name"`
		URL      string `json:"url"`
		IconName string `json:"iconName"`
		IconSvg  string `json:"iconSvg"`
	}
	if !decodeJSON(w, r, &in) {
		return
	}
	in.Name, in.URL = strings.TrimSpace(in.Name), strings.TrimSpace(in.URL)
	if msg := validAppFields(in.Name, in.URL); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	updated, err := s.auth.queries.UpdateApp(r.Context(), dbgen.UpdateAppParams{
		ID: id, Name: in.Name, Url: in.URL, IconName: in.IconName, IconSvg: in.IconSvg, UserID: userID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		http.Error(w, "app not found", http.StatusNotFound)
		return
	}
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, appResponse{ID: updated.ID, Name: updated.Name, URL: updated.Url, IconName: updated.IconName, IconSvg: updated.IconSvg})
}

func (s *startpage) deleteApp(w http.ResponseWriter, r *http.Request, userID int64) {
	id, ok := pathID(w, r, http.StatusNotFound, "app not found")
	if !ok {
		return
	}
	n, err := s.auth.queries.DeleteApp(r.Context(), dbgen.DeleteAppParams{ID: id, UserID: userID})
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	if n == 0 {
		http.Error(w, "app not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *startpage) restoreApp(w http.ResponseWriter, r *http.Request, userID int64) {
	id, ok := pathID(w, r, http.StatusNotFound, "app not found")
	if !ok {
		return
	}
	ctx := r.Context()
	var restored dbgen.RestoreAppRow
	err := s.inTx(ctx, func(q *dbgen.Queries) (err error) {
		if restored, err = q.RestoreApp(ctx, dbgen.RestoreAppParams{ID: id, UserID: userID}); err != nil {
			return err
		}
		return q.RenumberGroupAppsAfterRestore(ctx, id)
	})
	if errors.Is(err, pgx.ErrNoRows) {
		http.Error(w, "app not found", http.StatusNotFound)
		return
	}
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, appResponse{ID: restored.ID, Name: restored.Name, URL: restored.Url, IconName: restored.IconName, IconSvg: restored.IconSvg})
}

func decodeJSON(w http.ResponseWriter, r *http.Request, v any) bool {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return false
	}
	return true
}

func pathID(w http.ResponseWriter, r *http.Request, badStatus int, msg string) (int64, bool) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, msg, badStatus)
		return 0, false
	}
	return id, true
}

func (s *startpage) inTx(ctx context.Context, fn func(q *dbgen.Queries) error) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) //nolint:errcheck // no-op after commit
	if err := fn(s.auth.queries.WithTx(tx)); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

var urlScheme = regexp.MustCompile(`^([a-zA-Z][a-zA-Z0-9+.-]*)://`)

func validAppFields(name, url string) string {
	if name == "" || url == "" {
		return "name and url are required"
	}
	if m := urlScheme.FindStringSubmatch(url); m != nil && !strings.EqualFold(m[1], "http") && !strings.EqualFold(m[1], "https") {
		return "url must be http or https"
	}
	return ""
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
