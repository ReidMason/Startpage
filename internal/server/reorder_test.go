package server_test

import (
	"net/http"
	"testing"
)

type groupArrangement struct {
	ID     int64   `json:"id"`
	AppIDs []int64 `json:"appIds"`
}

func (b *browser) reorder(groups ...groupArrangement) int {
	b.t.Helper()
	resp, _ := b.do(http.MethodPut, "/api/startpage/arrangement", map[string]any{"groups": groups})
	return resp.StatusCode
}

func sameStrings(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func twoGroupsWithThreeApps(t *testing.T) (b *browser, g1, g2 int64, ids [3]int64) {
	b, dbURL := signedIn(t)
	g1 = b.startpage().Groups[0].ID
	execSQL(t, dbURL, "INSERT INTO groups (user_id, name, position) SELECT user_id, 'Media', 1 FROM groups WHERE id = $1", g1)
	g2 = b.startpage().Groups[1].ID
	for i, name := range []string{"Plex", "Sonarr", "Radarr"} {
		_, a := b.createApp(plexApp(map[string]any{"name": name}))
		ids[i] = a.ID
	}
	return
}

func TestReorderAppsWithinGroup(t *testing.T) {
	b, g1, g2, ids := twoGroupsWithThreeApps(t)

	if status := b.reorder(groupArrangement{g1, []int64{ids[2], ids[0], ids[1]}}, groupArrangement{g2, []int64{}}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}

	if got := appNames(b.startpage().Groups[0].Apps); !sameStrings(got, []string{"Radarr", "Plex", "Sonarr"}) {
		t.Errorf("order = %v", got)
	}
}

func TestMoveAppToAnotherGroupIncludingEmptyOne(t *testing.T) {
	b, g1, g2, ids := twoGroupsWithThreeApps(t)

	if status := b.reorder(groupArrangement{g1, []int64{ids[0], ids[2]}}, groupArrangement{g2, []int64{ids[1]}}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}

	sp := b.startpage()
	if got := appNames(sp.Groups[0].Apps); !sameStrings(got, []string{"Plex", "Radarr"}) {
		t.Errorf("group 1 = %v", got)
	}
	if got := appNames(sp.Groups[1].Apps); !sameStrings(got, []string{"Sonarr"}) {
		t.Errorf("group 2 = %v", got)
	}
}

func TestReorderGroupsKeepsTheirApps(t *testing.T) {
	b, g1, g2, ids := twoGroupsWithThreeApps(t)

	if status := b.reorder(groupArrangement{g2, []int64{}}, groupArrangement{g1, []int64{ids[0], ids[1], ids[2]}}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}

	sp := b.startpage()
	if sp.Groups[0].ID != g2 || sp.Groups[1].ID != g1 || len(sp.Groups[1].Apps) != 3 {
		t.Errorf("groups = %+v", sp.Groups)
	}
}

func TestInvalidArrangementChangesNothing(t *testing.T) {
	b, g1, g2, ids := twoGroupsWithThreeApps(t)

	cases := map[string][]groupArrangement{
		"missing app":       {{g1, []int64{ids[0], ids[1]}}, {g2, []int64{}}},
		"missing group":     {{g1, []int64{ids[0], ids[1], ids[2]}}},
		"duplicate app":     {{g1, []int64{ids[0], ids[0], ids[1], ids[2]}}, {g2, []int64{}}},
		"unknown app":       {{g1, []int64{ids[0], ids[1], ids[2], ids[2] + 999}}, {g2, []int64{}}},
		"duplicate group":   {{g1, []int64{ids[0], ids[1], ids[2]}}, {g1, []int64{}}},
		"partly valid move": {{g1, []int64{ids[2]}}, {g2, []int64{ids[0], ids[1], ids[1] + 999}}},
	}
	for name, arrangement := range cases {
		if status := b.reorder(arrangement...); status != http.StatusConflict {
			t.Errorf("%s: status %d, want 409", name, status)
		}
	}

	sp := b.startpage()
	if got := appNames(sp.Groups[0].Apps); !sameStrings(got, []string{"Plex", "Sonarr", "Radarr"}) || len(sp.Groups[1].Apps) != 0 {
		t.Errorf("rejected arrangements changed the page: %+v", sp.Groups)
	}
}

func TestReorderRequiresSignIn(t *testing.T) {
	ts, _ := startServer(t)
	b := newBrowser(t, ts)
	if status := b.reorder(); status != http.StatusUnauthorized {
		t.Errorf("status %d, want 401", status)
	}
}

func TestUsersCannotReorderEachOthersApps(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")
	_, plex := alice.createApp(plexApp(nil))
	aliceGroup := alice.startpage().Groups[0]
	bobGroup := bob.startpage().Groups[0]

	if status := bob.reorder(groupArrangement{aliceGroup.ID, []int64{plex.ID}}); status != http.StatusConflict {
		t.Errorf("bob arranging alice's group: status %d, want 409", status)
	}
	if status := bob.reorder(groupArrangement{bobGroup.ID, []int64{plex.ID}}); status != http.StatusConflict {
		t.Errorf("bob stealing alice's app: status %d, want 409", status)
	}

	if got := appNames(alice.startpage().Groups[0].Apps); !sameStrings(got, []string{"Plex"}) {
		t.Errorf("alice's page changed: %v", got)
	}
	if n := len(bob.startpage().Groups[0].Apps); n != 0 {
		t.Errorf("bob has %d apps, want 0", n)
	}
}
