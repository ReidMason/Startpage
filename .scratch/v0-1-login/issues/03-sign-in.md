# 03: Sign in: redirect, callback, User, Session, current user

**What to build:** An unauthenticated visit redirects to Authentik (authorization code flow). The callback validates the ID token, upserts the User keyed on the OIDC subject (storing the display name), and sets an opaque Session cookie (HttpOnly, Secure, SameSite=Lax) whose hash is stored in Postgres with a 30-day expiry. `GET /api/me` returns the current User's display name, or 401 without a valid Session. Any user Authentik admits is allowed; there is no group logic.

**Blocked by:** 02

**Status:** resolved

- [x] Unauthenticated request redirects to the provider
- [x] Callback creates a User and Session cookie on first login
- [x] A second login reuses the same User
- [x] `/api/me` returns the display name with a Session and 401 without
- [x] Only a hash of the Session ID is stored
- [x] Handler-level tests with stub OIDC and real Postgres cover the above
