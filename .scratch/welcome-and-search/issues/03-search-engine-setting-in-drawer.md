# 03: Search engine Setting in the drawer

**What to build:** The Settings drawer edits a single drawer-wide draft of Settings, with the page previewing the draft live. A Save/Discard bar appears when the draft is dirty. The first Setting in it is the Search engine: a free-text address with five preset buttons. The search bar uses the saved Search engine.

**Blocked by:** 01, 02

**Status:** resolved

- [x] Presets DuckDuckGo, Google, Bing, Brave and Kagi fill the text box; the one matching the box exactly is highlighted, and none is when the text is custom
- [x] An invalid address shows an inline message and disables Save
- [x] The Save/Discard bar appears only while the draft differs from saved Settings
- [x] Save sends one partial update with the changed fields; on failure the draft is kept and an error is shown
- [x] Discard reverts the draft and the page to saved Settings
- [x] The page behind the drawer renders from the draft
- [x] After Save, the search bar sends queries to the saved Search engine, and a reload shows it with no flash of defaults
