# 02: Edit mode and App modal

**What to build:** A bottom-left Edit button turns the page into the editor (it becomes Done). In edit mode each Group shows an "Add app" tile, and clicking a tile selects it instead of opening its URL. Selecting a tile or "Add app" opens one shared modal for name, URL and icon, with Iconify search. The modal edits a local draft; Save creates or updates the App and Cancel, Escape or clicking outside discards the draft, so a cancelled new App is never created.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Edit/Done toggles edit mode; outside edit mode the grid stays fully read-only
- [ ] Clicking a tile in edit mode opens the modal and does not navigate
- [ ] The modal searches Iconify by keyword and previews the chosen icon live
- [ ] Choosing an icon stores its SVG body with the App on Save
- [ ] Save creates (new) or updates (existing) the App; nothing is sent before Save
- [ ] Cancel, Escape and outside click discard the draft; a cancelled new App leaves nothing behind
- [ ] Update-App endpoint is in the OpenAPI spec with handler-level integration tests, including per-User isolation
