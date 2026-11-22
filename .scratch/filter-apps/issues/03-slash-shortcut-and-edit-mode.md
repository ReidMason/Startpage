# 03: `/` shortcut and edit-mode rules

**What to build:** Pressing `/` while nothing is focused focuses the search bar without typing anything into it. The shortcut works whether or not the bar already holds a query. It is ignored while focus is in any text field, modal or the Settings drawer. Filter mode never applies in edit mode: entering edit mode clears any query, and the shortcut is disabled there because the bar is disabled.

**Blocked by:** 01: Filter mode: flat ranked results

**Status:** ready-for-agent

- [ ] `/` with nothing focused focuses the bar and inserts no character
- [ ] The shortcut works with an empty bar, a normal query and a Filter mode query
- [ ] The shortcut is ignored in text inputs, textareas, the App modal and the Settings drawer, so a `/` can still be typed there
- [ ] Entering edit mode clears the query and shows the full page
- [ ] In edit mode the bar stays disabled and dimmed, and the shortcut does nothing
- [ ] Verified by running the app
