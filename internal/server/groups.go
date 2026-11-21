package server

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

func (s *startpage) createGroup(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
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
	if err := q.LockUser(ctx, userID); err != nil {
		s.auth.internalError(w, err)
		return
	}
	if err := q.CreateFirstGroupIfNone(ctx, userID); err != nil {
		s.auth.internalError(w, err)
		return
	}
	g, err := q.CreateGroup(ctx, dbgen.CreateGroupParams{UserID: userID, Name: strings.TrimSpace(in.Name)})
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	if err := tx.Commit(ctx); err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, groupResponse{ID: g.ID, Name: g.Name, Style: g.Style, Collapsed: g.Collapsed, Apps: []appResponse{}})
}

func (s *startpage) updateGroup(w http.ResponseWriter, r *http.Request, userID int64) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid group id", http.StatusBadRequest)
		return
	}
	var in struct {
		Name      *string `json:"name"`
		Style     *string `json:"style"`
		Collapsed *bool   `json:"collapsed"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}
	if in.Name == nil && in.Style == nil && in.Collapsed == nil {
		http.Error(w, "name, style or collapsed is required", http.StatusBadRequest)
		return
	}
	if in.Style != nil && *in.Style != "tiles" && *in.Style != "compact" {
		http.Error(w, "style must be tiles or compact", http.StatusBadRequest)
		return
	}
	params := dbgen.UpdateGroupParams{ID: id, UserID: userID}
	if in.Name != nil {
		params.Name = pgtype.Text{String: strings.TrimSpace(*in.Name), Valid: true}
	}
	if in.Style != nil {
		params.Style = pgtype.Text{String: *in.Style, Valid: true}
	}
	if in.Collapsed != nil {
		params.Collapsed = pgtype.Bool{Bool: *in.Collapsed, Valid: true}
	}
	n, err := s.auth.queries.UpdateGroup(r.Context(), params)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	if n == 0 {
		http.Error(w, "group not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
