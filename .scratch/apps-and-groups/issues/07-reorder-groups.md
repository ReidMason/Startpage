# 07: Reorder Groups

**What to build:** In edit mode a User drags a Group by its handle to change Group order. Group drags and tile drags never interfere, and a Group moves with all its Apps.

**Blocked by:** 04, 06

**Status:** ready-for-agent

- [ ] Each Group in edit mode has a drag handle; only the handle starts a Group drag
- [ ] Dragging a Group reorders Groups without moving Apps between them
- [ ] Dragging a tile never reorders Groups
- [ ] The reorder endpoint persists Group order together with App order, covered by integration tests
