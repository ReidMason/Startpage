package server

import (
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

func (s *startpage) createGroup(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		Name string `json:"name"`
	}
	if !decodeJSON(w, r, &in) {
		return
	}
	name := strings.TrimSpace(in.Name)
	if name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	var g dbgen.CreateGroupRow
	err := s.inTx(ctx, func(q *dbgen.Queries) (err error) {
		if err = q.LockUser(ctx, userID); err != nil {
			return err
		}
		if err = q.CreateFirstGroupIfNone(ctx, userID); err != nil {
			return err
		}
		g, err = q.CreateGroup(ctx, dbgen.CreateGroupParams{UserID: userID, Name: name})
		return err
	})
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, groupResponse{ID: g.ID, Name: g.Name, Style: g.Style, Collapsed: g.Collapsed, Apps: []appResponse{}})
}

func (s *startpage) updateGroup(w http.ResponseWriter, r *http.Request, userID int64) {
	id, ok := pathID(w, r, http.StatusBadRequest, "invalid group id")
	if !ok {
		return
	}
	var in struct {
		Name      *string `json:"name"`
		Style     *string `json:"style"`
		Collapsed *bool   `json:"collapsed"`
	}
	if !decodeJSON(w, r, &in) {
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
		name := strings.TrimSpace(*in.Name)
		if name == "" {
			http.Error(w, "name cannot be blank", http.StatusBadRequest)
			return
		}
		params.Name = pgtype.Text{String: name, Valid: true}
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
