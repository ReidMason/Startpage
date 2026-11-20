# 02: Startup config validation and OIDC discovery

**What to build:** The app reads its configuration from environment variables only (`DATABASE_URL`, `PUBLIC_BASE_URL`, `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`). At startup it exits non-zero with a clear message naming the missing variable or failed discovery and pointing to the README. On success it logs the expected redirect URI. The client secret is never logged or persisted. Adds a stub OIDC provider to the test harness.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Each missing env var produces an error naming it and referencing the README
- [ ] Failed OIDC discovery exits non-zero with a clear error
- [ ] Successful start logs the expected redirect URI and never the secret
- [ ] Stub OIDC provider available to tests
- [ ] Tests cover missing config, failed discovery and successful start
