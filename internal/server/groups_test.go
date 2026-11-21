package server_test

import (
	"encoding/json"
	"net/http"
	"strconv"
	"testing"
)

func (b *browser) setCollapsed(groupID int64, collapsed bool) int {
	b.t.Helper()
	resp, _ := b.do(http.MethodPatch, "/api/groups/"+itoa(groupID), map[string]any{"collapsed": collapsed})
	return resp.StatusCode
}

func itoa(n int64) string { return strconv.FormatInt(n, 10) }

func TestGroupsStartExpandedAndCollapsedStatePersistsPerGroup(t *testing.T) {
	b, dbURL := signedIn(t)
	first := b.startpage().Groups[0]
	execSQL(t, dbURL, "INSERT INTO groups (user_id, name, position) SELECT user_id, 'Media', 1 FROM groups WHERE id = $1", first.ID)
	sp := b.startpage()
	if sp.Groups[0].Collapsed || sp.Groups[1].Collapsed {
		t.Fatalf("groups should start expanded: %+v", sp.Groups)
	}
	media := sp.Groups[1]

	if status := b.setCollapsed(media.ID, true); status != http.StatusNoContent {
		t.Fatalf("collapse status %d, want 204", status)
	}
	sp = b.startpage()
	if sp.Groups[0].Collapsed || !sp.Groups[1].Collapsed {
		t.Errorf("collapsed = [%v %v], want [false true]", sp.Groups[0].Collapsed, sp.Groups[1].Collapsed)
	}

	if status := b.setCollapsed(media.ID, false); status != http.StatusNoContent {
		t.Fatalf("expand status %d, want 204", status)
	}
	if b.startpage().Groups[1].Collapsed {
		t.Error("group should be expanded again")
	}
}

func TestUpdateGroupRejectsOtherUsersMissingGroupsAndAnonymous(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")
	aliceGroup := alice.startpage().Groups[0]

	if status := bob.setCollapsed(aliceGroup.ID, true); status != http.StatusNotFound {
		t.Errorf("collapsing another user's group: status %d, want 404", status)
	}
	if alice.startpage().Groups[0].Collapsed {
		t.Error("alice's group was collapsed by bob")
	}
	if status := bob.setCollapsed(999999, true); status != http.StatusNotFound {
		t.Errorf("missing group: status %d, want 404", status)
	}
	if resp, _ := bob.do(http.MethodPatch, "/api/groups/abc", map[string]any{"collapsed": true}); resp.StatusCode != http.StatusBadRequest {
		t.Errorf("bad id: status %d, want 400", resp.StatusCode)
	}
	anon := newBrowser(t, ts)
	if status := anon.setCollapsed(aliceGroup.ID, true); status != http.StatusUnauthorized {
		t.Errorf("anonymous: status %d, want 401", status)
	}
}

func (b *browser) createGroup(body map[string]any) (int, groupJSON) {
	b.t.Helper()
	resp, raw := b.do(http.MethodPost, "/api/groups", body)
	var g groupJSON
	if resp.StatusCode == http.StatusCreated {
		if err := json.Unmarshal(raw, &g); err != nil {
			b.t.Fatalf("decode group: %v", err)
		}
	}
	return resp.StatusCode, g
}

func (b *browser) patchGroup(id int64, body map[string]any) int {
	b.t.Helper()
	resp, _ := b.do(http.MethodPatch, "/api/groups/"+itoa(id), body)
	return resp.StatusCode
}

func TestCreateGroupAppendsEmptyTilesGroupAtEnd(t *testing.T) {
	b, _ := signedIn(t)
	b.startpage()

	status, one := b.createGroup(map[string]any{"name": "  Media "})
	if status != http.StatusCreated {
		t.Fatalf("status %d, want 201", status)
	}
	if one.Name != "Media" || one.Style != "tiles" || one.Collapsed || len(one.Apps) != 0 {
		t.Errorf("created = %+v", one)
	}
	_, two := b.createGroup(map[string]any{})
	sp := b.startpage()
	if len(sp.Groups) != 3 || sp.Groups[1].ID != one.ID || sp.Groups[2].ID != two.ID {
		t.Errorf("groups = %+v, want [first, %d, %d]", sp.Groups, one.ID, two.ID)
	}
}

func TestCreateGroupBeforeStartpageLoadedKeepsNewGroupAfterFirst(t *testing.T) {
	b, _ := signedIn(t)
	_, g := b.createGroup(map[string]any{"name": "Media"})
	sp := b.startpage()
	if len(sp.Groups) != 2 || sp.Groups[1].ID != g.ID {
		t.Errorf("groups = %+v, want unlabelled first then new group", sp.Groups)
	}
}

func TestUpdateGroupRenamesAndSwitchesStyle(t *testing.T) {
	b, _ := signedIn(t)
	b.startpage()
	_, g := b.createGroup(map[string]any{"name": "Media"})

	if status := b.patchGroup(g.ID, map[string]any{"name": "Movies", "style": "compact"}); status != http.StatusNoContent {
		t.Fatalf("status %d, want 204", status)
	}
	got := b.startpage().Groups[1]
	if got.Name != "Movies" || got.Style != "compact" {
		t.Errorf("group = %+v", got)
	}
	if status := b.patchGroup(g.ID, map[string]any{"style": "tiles"}); status != http.StatusNoContent {
		t.Fatalf("status %d", status)
	}
	got = b.startpage().Groups[1]
	if got.Name != "Movies" || got.Style != "tiles" {
		t.Errorf("partial update changed other fields: %+v", got)
	}
	if status := b.patchGroup(g.ID, map[string]any{"name": ""}); status != http.StatusNoContent {
		t.Fatalf("clearing name: status %d", status)
	}
	if b.startpage().Groups[1].Name != "" {
		t.Error("name should be clearable")
	}
}

func TestUpdateGroupRejectsInvalidBodies(t *testing.T) {
	b, _ := signedIn(t)
	g := b.startpage().Groups[0]
	for _, body := range []map[string]any{{}, {"style": "grid"}, {"name": 5}} {
		if status := b.patchGroup(g.ID, body); status != http.StatusBadRequest {
			t.Errorf("body %v: status %d, want 400", body, status)
		}
	}
}

func TestGroupCreateAndEditAreIsolatedPerUser(t *testing.T) {
	ts, _, provider := startApp(t)
	alice := signInAs(t, ts, provider, "sub-alice", "Alice")
	bob := signInAs(t, ts, provider, "sub-bob", "Bob")
	aliceGroup := alice.startpage().Groups[0]
	bob.startpage()

	if status := bob.patchGroup(aliceGroup.ID, map[string]any{"name": "Hacked", "style": "compact"}); status != http.StatusNotFound {
		t.Errorf("status %d, want 404", status)
	}
	if got := alice.startpage().Groups[0]; got.Name != "" || got.Style != "tiles" {
		t.Errorf("alice's group changed: %+v", got)
	}
	bob.createGroup(map[string]any{"name": "Bob's"})
	if n := len(alice.startpage().Groups); n != 1 {
		t.Errorf("alice has %d groups, want 1", n)
	}
	anon := newBrowser(t, ts)
	if status, _ := anon.createGroup(map[string]any{}); status != http.StatusUnauthorized {
		t.Errorf("anonymous create: status %d, want 401", status)
	}
}
