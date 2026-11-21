# 01: Show Apps in Groups

**What to build:** A signed-in User sees their Apps as a read-only grid of big-icon tiles organised into Groups, painted instantly from cache. A new User has one empty, unlabelled first Group created lazily. Apps can be created through the API (name, URL, icon name and SVG body), so the grid can be demoed end to end. The first Group has no label; later Groups show a muted label; each Group renders as tiles or compact rows. Clicking a tile opens its URL, prepending `https://` when no scheme was entered.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Groups and Apps persist in Postgres with ordering, a soft-delete timestamp and stored icon SVG
- [ ] A new User's Startpage response contains one empty first Group
- [ ] Create-App endpoint adds an App to a chosen Group (default: first Group)
- [ ] Get-Startpage endpoint returns Groups in order, each with its live Apps in order
- [ ] Both endpoints are in the OpenAPI spec and the TypeScript client is regenerated
- [ ] The SPA renders the grid from the stored SVGs with no Iconify call, first Group unlabelled, later Groups with muted labels, tiles and compact styles
- [ ] The SPA paints from a localStorage cache and revalidates after first paint
- [ ] Handler-level integration tests cover the above, one User never seeing another's Apps or Groups, and 401 when signed out
