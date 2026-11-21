# 05: Unsaved-changes guards

**What to build:** A User cannot silently lose a dirty Settings draft by leaving edit mode or closing the tab.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Pressing Done with a dirty draft prompts Save, Discard or Keep editing, and each choice behaves accordingly
- [ ] Pressing Done with a clean draft exits edit mode with no prompt
- [ ] Closing or reloading the tab with a dirty draft triggers the browser's unload warning
- [ ] No warning appears when the draft is clean
