# 04: Reorder Apps

**What to build:** In edit mode a User drags tiles to reorder them within a Group or move them to another Group, including an empty one. Dropping a tile never opens its modal. The result persists atomically.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Tiles can be dragged within a Group and across Groups, including into an empty Group
- [ ] A drag never registers as a click, so the modal doesn't open after a drop
- [ ] One reorder endpoint accepts the full desired arrangement and applies it atomically
- [ ] The endpoint is in the OpenAPI spec with integration tests for reorder, cross-Group move and per-User isolation
