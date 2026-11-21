package server

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ReidMason/startpage/internal/db/dbgen"
)

func (s *startpage) updateGroup(w http.ResponseWriter, r *http.Request, userID int64) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid group id", http.StatusBadRequest)
		return
	}
	var in struct {
		Collapsed *bool `json:"collapsed"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.Collapsed == nil {
		http.Error(w, "collapsed is required", http.StatusBadRequest)
		return
	}
	n, err := s.auth.queries.SetGroupCollapsed(r.Context(), dbgen.SetGroupCollapsedParams{Collapsed: *in.Collapsed, ID: id, UserID: userID})
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
