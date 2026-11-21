package server_test

import (
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
