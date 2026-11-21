# 01: Welcome header and search bar

**What to build:** The top of the Startpage shows a search bar, then today's date, then a time-based greeting with no name, replacing "Hello, {name}". Pressing Enter in the search bar opens the Search engine (hard-coded to DuckDuckGo for now) with the query appended. In edit mode the bar is disabled and dimmed.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Layout matches the mockup: underlined borderless search input, then the long-form date, then the greeting
- [x] Greeting is Good Morning before 12:00, Good Afternoon before 18:00, otherwise Good Evening, from browser-local time
- [x] Date and greeting refresh about once a minute while the tab is open
- [x] The search bar is focused on page load outside edit mode
- [x] Enter navigates to the DuckDuckGo address with the URL-encoded query appended; an empty query does nothing
- [x] In edit mode the bar is visible, disabled and dimmed, and the layout does not shift
- [x] The "Hello, {name}" heading is gone
