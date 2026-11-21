# 05: Collapse Groups

**What to build:** Clicking a Group's label collapses or expands it. The chevron appears only while hovering the label. Collapsed state is remembered per Group and per User, and every Group starts expanded.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Clicking a label toggles its Group; the chevron shows only on label hover
- [ ] All Groups are expanded for a new User
- [ ] Collapsed state is persisted on the Group and restored on reload and on another device
- [ ] The update-Group endpoint for the collapsed flag is in the OpenAPI spec with integration tests
