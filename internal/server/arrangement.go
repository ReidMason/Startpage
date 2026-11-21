package server

import (
	"errors"
	"net/http"
	"slices"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

type arrangementGroup struct {
	ID     int64   `json:"id"`
	AppIDs []int64 `json:"appIds"`
}

var errArrangementMismatch = errors.New("arrangement does not match")

func (s *startpage) arrange(w http.ResponseWriter, r *http.Request, userID int64) {
	var in struct {
		Groups []arrangementGroup `json:"groups"`
	}
	if !decodeJSON(w, r, &in) {
		return
	}
	ctx := r.Context()
	err := s.inTx(ctx, func(q *dbgen.Queries) error {
		if err := q.LockUser(ctx, userID); err != nil {
			return err
		}
		groups, err := q.ListGroups(ctx, userID)
		if err != nil {
			return err
		}
		apps, err := q.ListLiveApps(ctx, userID)
		if err != nil {
			return err
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
			return errArrangementMismatch
		}
		for i, g := range in.Groups {
			if err := q.SetGroupPosition(ctx, dbgen.SetGroupPositionParams{ID: g.ID, Position: int32(i), UserID: userID}); err != nil {
				return err
			}
			for j, id := range g.AppIDs {
				if err := q.SetAppPlacement(ctx, dbgen.SetAppPlacementParams{ID: id, GroupID: g.ID, Position: int32(j), UserID: userID}); err != nil {
					return err
				}
			}
		}
		return nil
	})
	if errors.Is(err, errArrangementMismatch) {
		http.Error(w, "arrangement does not match the current groups and apps", http.StatusConflict)
		return
	}
	if err != nil {
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
