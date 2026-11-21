# 02: Settings storage and API

**What to build:** Per-User Settings are stored server-side and returned with the Startpage, with a partial-update endpoint. The first two Settings are the Search engine address (default DuckDuckGo) and whether to show the name in the greeting (default off).

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A User with no stored Settings gets defaults in the Startpage payload
- [ ] The partial-update endpoint changes only the fields supplied
- [ ] Updated Settings appear in the next Startpage read
- [ ] A Search engine address that is not a valid http or https URL returns 400 and changes nothing
- [ ] One User's Settings never affect another's
- [ ] The OpenAPI contract is updated and the web client regenerated
- [ ] Integration tests in the existing server test seam cover the above
