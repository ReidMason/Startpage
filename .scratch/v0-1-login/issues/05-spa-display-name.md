# 05: SPA shows your name, with fast repeat loads

**What to build:** An OpenAPI spec for the v0.1 API and a generated TypeScript client. The page paints the User's display name instantly from localStorage on repeat visits, then revalidates via the API after first paint. A 401 triggers the login redirect. A sign-out button ends the Session. Demo: sign in, open a new tab, and see the name appear immediately.

**Blocked by:** 03, 04

**Status:** ready-for-agent

- [ ] OpenAPI spec exists and the TS client is generated from it
- [ ] Repeat visits paint the cached name before any network response
- [ ] The name is refreshed from the API after paint
- [ ] A 401 sends the browser through login
- [ ] Sign-out ends the Session and returns to login
