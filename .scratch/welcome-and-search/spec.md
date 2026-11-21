# Welcome text and search bar

Status: ready-for-agent

## Problem Statement

A User's Startpage opens with a plain "Hello, {name}" heading and no way to search. The User must leave the new tab to search the web, the greeting carries no date or time context, and there is nowhere to personalise any of it. The Settings drawer is an empty shell and no Setting is stored anywhere.

## Solution

The top of the Startpage shows a search bar (underlined, borderless, autofocused), then today's date, then a time-based greeting ("Good Morning/Afternoon/Evening"). Submitting the search opens the User's chosen Search engine. The Search engine and a "Show name in greeting" toggle become the first Settings, edited in the Settings drawer during edit mode with a single drawer-wide draft, live preview, and one Save/Discard bar.

## User Stories

1. As a User, I want a search bar at the top of my Startpage, so that I can search the web without leaving my new tab.
2. As a User, I want the search bar focused when the page loads, so that I can start typing immediately.
3. As a User, I want pressing Enter to open my Search engine with my query, so that I get results in one step.
4. As a User, I want my query URL-encoded when sent, so that special characters search correctly.
5. As a User, I want an empty search to do nothing, so that I don't land on a blank results page by accident.
6. As a User, I want the search bar disabled and dimmed in edit mode, so that I don't search by accident while editing.
7. As a User, I want the layout not to shift when the search bar is disabled, so that I can see my real page while editing.
8. As a User, I want to see today's date in long form (e.g. "Friday, 20th November 2026"), so that I know the day at a glance.
9. As a User, I want a greeting that matches the time of day, so that the page feels personal.
10. As a User, I want the greeting and date to update while the tab stays open, so that a tab left overnight is not stale.
11. As a User, I want the greeting based on my browser's local time, so that it matches where I am.
12. As a User, I want to choose my Search engine from presets (DuckDuckGo, Google, Bing, Brave, Kagi), so that I can pick a common one in one click.
13. As a User, I want to type any custom Search engine address, so that I am not limited to the presets.
14. As a User, I want the matching preset highlighted when my address equals one, so that I can see what I'm using.
15. As a User, I want no preset highlighted when I type a custom address, so that the state is honest.
16. As a User, I want an invalid Search engine address rejected with an inline message, so that I can't break my search.
17. As a User, I want the default Search engine to be DuckDuckGo, so that search works before I configure anything.
18. As a User, I want a "Show name in greeting" toggle, so that I can choose "Good Evening, Reid" over "Good Evening".
19. As a User, I want the name hidden by default, so that the page matches the plain design until I opt in.
20. As a User, I want my Settings stored against my Startpage, so that they follow me across browsers.
21. As a User, I want my Settings correct on first paint, so that I never see a flash of default values.
22. As a User, I want Settings edits held as a draft until I press Save, so that I can't accidentally break my configuration.
23. As a User, I want Save and Discard to appear only when I have unsaved changes, so that the drawer stays uncluttered.
24. As a User, I want the page to preview my draft live, so that I can see the effect before committing.
25. As a User, I want Discard to revert the page to my saved Settings, so that experiments are safe.
26. As a User, I want to be asked to save, discard or keep editing when I press Done with unsaved changes, so that I never lose work silently.
27. As a User, I want a browser warning if I close the tab with unsaved changes, so that I don't lose them by accident.
28. As a User, I want one Save for all Settings, so that adding more Settings later doesn't multiply save buttons.
29. As a User, I want each User's Settings independent of every other User's, so that household members don't affect each other.
30. As a User, I want a failed save to keep my draft and tell me, so that I can retry.

## Implementation Decisions

- **Greeting and date:** computed in the browser from local time, thresholds Morning before 12:00, Afternoon before 18:00, Evening otherwise. Refreshed about once a minute. Date format is weekday, ordinal day, month name, year.
- **Search bar:** borderless input with a bottom rule, placed above the date and greeting inside the existing page card. Submit navigates the current tab to the Search engine address with the URL-encoded query appended to the end. Autofocused outside edit mode; disabled and dimmed in edit mode.
- **Search engine Setting:** a free-text address; the query is always appended, with no template syntax. Preset buttons fill the text box and are not stored separately; a preset shows as selected when the box exactly equals its address. Presets: DuckDuckGo `https://duckduckgo.com/?q=`, Google `https://www.google.com/search?q=`, Bing `https://www.bing.com/search?q=`, Brave `https://search.brave.com/search?q=`, Kagi `https://kagi.com/search?q=`. Default is DuckDuckGo.
- **Validation:** the address must be a valid http or https URL. Enforced client-side (inline message, Save disabled) and server-side (400).
- **Show name in greeting Setting:** boolean, default off. When on, greeting reads "Good Evening, {display name}". The display-name fetch is used only when this is on.
- **Storage:** new per-User settings table, one row per User, created lazily with defaults (no row means defaults). Settings are returned inside the existing Startpage read payload and so are covered by the existing first-paint cache.
- **API:** partial-update endpoint for Settings; omitted fields are unchanged; invalid values return 400. The OpenAPI contract is updated and the generated web client regenerated.
- **Drawer:** one drawer-wide draft shared by all Settings. A Save/Discard bar appears at the bottom of the drawer only while the draft differs from saved Settings. Save sends one partial update with the changed fields; on failure the draft is kept and an error shown. The page behind the drawer renders from the draft (live preview); Discard reverts it. Pressing Done while dirty prompts Save / Discard / Keep editing. A `beforeunload` warning covers tab close while dirty.
- **Glossary:** **Setting** and **Search engine** added to `GLOSSARY.md`. No ADR; nothing here is hard to reverse.

## Testing Decisions

- A good test exercises external behaviour only (HTTP in, HTTP out), not implementation details.
- One seam: the existing server integration seam, an HTTP server backed by a real database with a signed-in browser helper, as used by the Apps and Groups tests.
- Cover: default Settings when none stored; partial update changes only the given fields; updated Settings appear in the Startpage payload; invalid or non-http(s) Search engine address gives 400 and changes nothing; Settings are isolated between Users.
- No frontend tests: the web package has no test setup and this UI is presentational. Frontend behaviour is verified by running the app.
- Prior art: the existing Startpage, Groups and reorder tests in the server package.

## Out of Scope

- Theme switching, weather, calendar link, background image, capitalise-names option and other Settings.
- Filtering Apps from the search bar.
- Search suggestions or autocomplete.
- Opening results in a new tab.
- Multiple Settings pages or sections (the single draft is designed to extend to them).
- Hiding or showing the date.

## Further Notes

- Seams were proposed to match existing ones; confirm the single backend integration seam is acceptable.
- The Settings drawer currently holds only a placeholder; this spec adds its first real contents.
