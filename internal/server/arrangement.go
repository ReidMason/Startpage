package server

import (
	"encoding/json"
	"net/http"
	"slices"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

type arrangementGroup struct {
	ID     int64   `json:"id"`
	AppIDs []int64 `json:"appIds"`
}

// arrange replaces the whole Group order and each Group's App order atomically; a stale or foreign arrangement is rejected with 409.
func (s *startpage) arrange(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		Groups []arrangementGroup `json:"groups"`
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
	groups, err := q.ListGroups(ctx, userID)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	apps, err := q.ListLiveApps(ctx, userID)
	if err != nil {
		s.auth.internalError(w, err)
		return
	}
	var wantGroups, wantApps []int64
	for _, g := range groups {
		wantGroups = append(wantGroups, g.ID)
	}
	for _, a := range apps {
		wantApps = append(wantApps, a.ID)
	}
	var gotGroups, gotApps []int64
	for _, g := range in.Groups {
		gotGroups = append(gotGroups, g.ID)
		gotApps = append(gotApps, g.AppIDs...)
	}
	if !sameSet(wantGroups, gotGroups) || !sameSet(wantApps, gotApps) {
		http.Error(w, "arrangement does not match the current groups and apps", http.StatusConflict)
		return
	}
	for i, g := range in.Groups {
		if err := q.SetGroupPosition(ctx, dbgen.SetGroupPositionParams{ID: g.ID, Position: int32(i), UserID: userID}); err != nil {
			s.auth.internalError(w, err)
			return
		}
		for j, id := range g.AppIDs {
			if err := q.SetAppPlacement(ctx, dbgen.SetAppPlacementParams{ID: id, GroupID: g.ID, Position: int32(j), UserID: userID}); err != nil {
				s.auth.internalError(w, err)
				return
			}
		}
	}
	if err := tx.Commit(ctx); err != nil {
		s.auth.internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func sameSet(want, got []int64) bool {
	if len(want) != len(got) {
		return false
	}
	a, b := slices.Clone(want), slices.Clone(got)
	slices.Sort(a)
	slices.Sort(b)
	return slices.Equal(a, b)
}
