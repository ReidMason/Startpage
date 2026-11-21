# 02: Keyboard: open and force-search

**What to build:** Make Filter mode usable from the keyboard. Enter in the search bar opens the best match like clicking its tile, and does nothing if there are no matches, so `/foo` never goes to the Search engine. Shift+Enter sends the whole query, `/` included and URL-encoded, to the Search engine. The best match is ringed while the bar is focused and a filter is active. Tab moves focus from the bar down through the result tiles in visible order, and Enter on a focused tile opens it. Escape, from the bar or a tile, clears the query and returns focus to the bar.

**Blocked by:** 01: Filter mode: flat ranked results

**Status:** ready-for-agent

- [ ] Enter in the bar opens the best match using the existing App link behaviour, same tab
- [ ] Enter with no matches does nothing and sends nothing to the Search engine
- [ ] Shift+Enter navigates to the Search engine with the full query, `/` included, URL-encoded
- [ ] The first result has a ring while the bar is focused and a filter is active, and not otherwise
- [ ] Tab from the bar focuses the first result, and Tab and Shift+Tab move through results in visible order
- [ ] Enter on a focused tile opens the App
- [ ] Escape from the bar or a tile clears the query, restores the grouped layout and focuses the bar
- [ ] Verified by running the app
