package server

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
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

func (s *startpage) register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/startpage", s.authed(s.get))
	mux.HandleFunc("PUT /api/startpage/arrangement", s.authed(s.arrange))
	mux.HandleFunc("POST /api/apps", s.authed(s.createApp))
	mux.HandleFunc("PUT /api/apps/{id}", s.authed(s.updateApp))
	mux.HandleFunc("DELETE /api/apps/{id}", s.authed(s.deleteApp))
	mux.HandleFunc("POST /api/apps/{id}/restore", s.authed(s.restoreApp))
	mux.HandleFunc("POST /api/groups", s.authed(s.createGroup))
	mux.HandleFunc("PATCH /api/groups/{id}", s.authed(s.updateGroup))
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
	writeJSON(w, http.StatusOK, map[string]any{"groups": out})
}

// ensureFirstGroup lazily creates the first Group; the user row lock stops concurrent first requests creating two.
func (s *startpage) ensureFirstGroup(r *http.Request, userID int64) error {
	ctx := r.Context()
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) //nolint:errcheck // no-op after commit
	q := s.auth.queries.WithTx(tx)
	if err := q.LockUser(ctx, userID); err != nil {
		return err
	}
	if err := q.CreateFirstGroupIfNone(ctx, userID); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (s *startpage) createApp(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		GroupID  *int64 `json:"groupId"`
		Name     string `json:"name"`
		URL      string `json:"url"`
		IconName string `json:"iconName"`
		IconSvg  string `json:"iconSvg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}
	in.Name, in.URL = strings.TrimSpace(in.Name), strings.TrimSpace(in.URL)
	if in.Name == "" || in.URL == "" {
		http.Error(w, "name and url are required", http.StatusBadRequest)
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
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "app not found", http.StatusNotFound)
		return
	}
	var in struct {
		Name     string `json:"name"`
		URL      string `json:"url"`
		IconName string `json:"iconName"`
		IconSvg  string `json:"iconSvg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}
	in.Name, in.URL = strings.TrimSpace(in.Name), strings.TrimSpace(in.URL)
	if in.Name == "" || in.URL == "" {
		http.Error(w, "name and url are required", http.StatusBadRequest)
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
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "app not found", http.StatusNotFound)
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

// restoreApp makes room at the App's stored position before reinstating it, in one transaction.
func (s *startpage) restoreApp(w http.ResponseWriter, r *http.Request, userID int64) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "app not found", http.StatusNotFound)
		return
	}
	ctx := r.Context()
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	defer tx.Rollback(ctx) //nolint:errcheck // no-op after commit
	q := s.auth.queries.WithTx(tx)
	restored, err := q.RestoreApp(ctx, dbgen.RestoreAppParams{ID: id, UserID: userID})
	if errors.Is(err, pgx.ErrNoRows) {
		http.Error(w, "app not found", http.StatusNotFound)
		return
	}
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	if err := q.ShiftSiblingsForRestore(ctx, id); err != nil {
		s.auth.internalError(w, err)
		return
	}
	if err := tx.Commit(ctx); err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, appResponse{ID: restored.ID, Name: restored.Name, URL: restored.Url, IconName: restored.IconName, IconSvg: restored.IconSvg})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
