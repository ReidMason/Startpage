# 04: Show name in greeting toggle

**What to build:** A "Show name in greeting" Setting in the drawer, default off. When on, the greeting reads "Good Evening, {name}", previewed live from the draft.

**Blocked by:** 03

**Status:** resolved

- [x] The toggle is in the drawer and is off by default
- [x] Toggling it updates the greeting immediately as a draft preview
- [x] Save persists it; Discard reverts it
- [x] The display-name is fetched only when the Setting is on
- [x] The greeting never shows a blank or placeholder name while the name loads
