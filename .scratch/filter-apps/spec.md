# Filter mode in the search bar

Status: ready-for-agent

## Problem Statement

A User with many Apps on their Startpage has to scan Groups visually, or reach for the mouse, to open one. The search bar only sends queries to the Search engine, so there is no keyboard-first way to jump to an App.

## Solution

When the search bar's query starts with `/`, the Startpage enters Filter mode: Apps are fuzzy-matched by name against the text after the `/`, and the Groups are replaced by a single flat grid of big tiles ranked best match first. Enter opens the best match, Tab moves focus down through the result tiles, and Enter on a tile opens it. Shift+Enter still sends the query to the Search engine. Pressing `/` anywhere outside a text field focuses the search bar.

## User Stories

1. As a User, I want a query starting with `/` to filter my Apps instead of searching the web, so that I can jump to an App from the keyboard.
2. As a User, I want the filter to match on App names only, so that results are predictable.
3. As a User, I want matching to be case-insensitive, so that I don't think about capitalisation.
4. As a User, I want fuzzy matching in the style of fzf, so that abbreviations like `/gf` find the App I mean.
5. As a User, I want poor matches hidden, so that the results are not padded with noise.
6. As a User, I want results ordered best match first, so that the App I want is at the front.
7. As a User, I want ties broken by my page order (Group order, then App order), so that results are stable while I type.
8. As a User, I want results shown as one flat grid of big tiles with no Group headers, so that I can scan the matches quickly.
9. As a User, I want Apps in collapsed Groups to appear in results, so that collapsing never hides an App from search.
10. As a User, I want my Groups' collapsed state untouched by filtering, so that clearing the query restores my page exactly.
11. As a User, I want a bare `/` to keep the normal grouped layout, so that the layout doesn't jump before I type a character.
12. As a User, I want the layout to switch to the flat results once I type a character after `/`, so that I see matches immediately.
13. As a User, I want deleting the `/` to end Filter mode and restore the full page, so that I can get back easily.
14. As a User, I want "No matching apps" shown when nothing matches, so that I know the filter is working rather than the page being broken.
15. As a User, I want Enter in the search bar to open the best match, so that `/pla` then Enter launches an App in a few keystrokes.
16. As a User, I want Enter with no matches to do nothing, so that a typo doesn't send `/foo` to the Search engine.
17. As a User, I want Shift+Enter to send the whole query, including the `/`, to the Search engine, so that I can force a web search.
18. As a User, I want the forced search URL-encoded, so that special characters search correctly.
19. As a User, I want Tab from the search bar to move focus to the first result tile, so that I can pick a match other than the best one.
20. As a User, I want Tab and Shift+Tab to move through the results in visible order, so that focus order matches what I see.
21. As a User, I want Enter on a focused tile to open the App, so that I can launch it without the mouse.
22. As a User, I want opening an App from the keyboard to behave like clicking it, so that behaviour is the same everywhere.
23. As a User, I want the best match ringed while the bar is focused, so that I can see what Enter will open.
24. As a User, I want Escape to clear the query and return focus to the search bar, so that I can bail out from the bar or from a tile.
25. As a User, I want pressing `/` while nothing is focused to focus the search bar, so that I can start searching without the mouse.
26. As a User, I want that shortcut to type nothing into the bar, so that I can still choose between a web search and Filter mode.
27. As a User, I want the shortcut to work whether or not the bar already holds a query, so that it is always available.
28. As a User, I want the shortcut ignored while I'm typing in any text field, modal or drawer, so that I can still type a `/` in an App URL.
29. As a User, I want Filter mode switched off in edit mode, so that I always see my whole page while editing.
30. As a User, I want any query cleared when I enter edit mode, so that I don't get a stale dimmed `/foo` next to a full grid.
31. As a User, I want the shortcut disabled in edit mode, so that it can't focus the disabled bar.

## Implementation Decisions

- Filter mode is a client-side behaviour of the search bar and the Startpage grid. No API, schema or Settings change: it is not a Setting, and nothing is persisted.
- Ranking and thresholding live in one pure function that takes the Apps in page order plus the text after the `/`, and returns the matching Apps best first. It is the only new unit with its own logic.
- Matching uses the `fzf` npm package (fzf-for-js), on App names only. Results scoring below a cutoff are dropped. The cutoff is tuned during implementation against realistic App names.
- Ties on score are broken by page order. The best match is always the first result, so Enter, the ring and Tab order all start from the same App.
- Filter mode is active only when the query starts with `/` and has at least one character after it, and the page is not in edit mode. A bare `/` leaves the grouped layout in place.
- While active, the Groups are replaced by one grid of big tiles using the same tile presentation as a big-tile Group, with no Group labels. Collapse state is neither read nor changed.
- Results are the same App links as today, so Enter, and clicking, use the existing App href and same-tab navigation. Keyboard navigation relies on native focus of those links, with no arrow-key model.
- Search bar keys: Enter opens the best match (nothing if there are none); Shift+Enter sends the full query, `/` included, URL-encoded, to the Search engine; Tab moves into the tiles; Escape clears the query and refocuses the bar.
- The best-match ring shows only while a filter is active and the bar is focused.
- A global `/` key handler focuses the bar when no text field, modal or drawer has focus, and does nothing in edit mode. It does not insert the character. The bar's query state is lifted so the page can read it and clear it on entering edit mode.
- The glossary already defines **Filter mode**. No ADR: the decision is easy to reverse.

## Testing Decisions

- A good test exercises external behaviour only: given Apps and a query, which Apps come back and in what order. It doesn't assert on the matching library's internals or scores.
- The one seam is the pure ranking function. Cover: case-insensitivity, abbreviation matching, non-matches hidden, best match first, ties in page order, an empty or too-weak query, and Apps from different Groups competing in one ranking.
- This introduces Vitest as the first frontend test tooling, and a script to run it. No component or browser test tooling is added in this feature.
- Keyboard flows (Enter, Shift+Enter, Tab, Escape, `/`, edit mode) are verified by running the app, not by automated tests.
- Prior art: the existing Go integration tests under the server package set the repo's test style, but nothing in the frontend does yet, so this sets that precedent.

## Out of Scope

- Matching on URLs, Group names or anything besides App names.
- Arrow-key navigation, a new-tab open variant, or any other shortcut keys.
- Typo-tolerant (edit-distance) matching beyond what fzf-style matching gives.
- Remembering recent queries, or showing a command palette for other actions.
- Component or browser test tooling.
- Any change to the Search engine Setting or the Settings drawer.

## Further Notes

- Check the `fzf` package's bundle size, licence and maintenance when adding it. If it is a poor fit, `uFuzzy` is the fallback considered.
- The score cutoff is the one open parameter, so expect to adjust it after trying real App lists.
