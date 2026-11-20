Status: ready-for-agent

# v0.1: Authentik login and display name

## Problem Statement

The existing startpage is a single-user Next.js app with a JSON config file. It loads slowly for something opened on every new tab, and it can't give each household member their own Startpage. I want a rebuilt foundation that is fast to load, supports multiple Users behind a shared login, and can later host the full configurable Startpage.

## Solution

Rebuild the project as a Go backend serving an embedded static SPA. A User signs in through Authentik (OIDC) and lands on a page that shows their name. v0.1 deliberately does nothing else: it proves login, sessions, the Postgres-backed User model and the fast-load architecture, so every later feature (Apps, search, weather, theming) builds on a working base.

## User Stories

1. As a User, I want to be redirected to Authentik when I open the startpage signed out, so that I can sign in without creating a separate password.
2. As a User, I want to return to the startpage automatically after signing in, so that I don't have to navigate manually.
3. As a User, I want to see my display name on the page, so that I know I'm signed in as the right person.
4. As a User, I want my Session to last about 30 days of activity, so that opening a new tab never sends me through login.
5. As a User, I want my name to appear instantly on repeat visits, so that the page feels fast on every new tab.
6. As a User, I want the page shell to load from cache, so that first paint doesn't wait on a server round trip.
7. As a User, I want my name to be refreshed in the background after first paint, so that changes in Authentik eventually show up.
8. As a User, I want a sign-out option, so that I can end my Session on a shared computer.
9. As a household member, I want my own User created automatically on first login, so that I don't need an admin to onboard me.
10. As a household member, I want my Startpage to be separate from others' in the same deployment, so that our pages never interfere.
11. As the admin, I want any Authentik user the Authentik application policy admits to be allowed in, so that access control stays in Authentik.
12. As the admin, I want no groups logic in the app, so that setup stays simple.
13. As the admin, I want OIDC configured through environment variables, so that the secret comes from a Kubernetes Secret.
14. As the admin, I want the client secret never stored in Postgres or logged, so that it can't leak from the database or log pipeline.
15. As the admin, I want a README section on creating the Authentik provider and application, so that I can set it up without guessing.
16. As the admin, I want the README to list the redirect URI format and every env var, so that configuration is unambiguous.
17. As the admin, I want the app to exit at startup with a clear error naming any missing env var and pointing to the README, so that misconfiguration is obvious.
18. As the admin, I want the app to exit clearly if OIDC discovery fails, so that I find issuer URL mistakes immediately.
19. As the admin, I want the expected redirect URI logged at startup, so that I can compare it against Authentik.
20. As the admin, I want the container to be stateless, so that it can be redeployed or scaled without a volume.
21. As the admin, I want database migrations applied automatically at startup, so that upgrades need no manual steps.
22. As the admin, I want one container image containing the API and the SPA, so that deployment is a single workload.
23. As the admin, I want to revoke a Session, so that a lost device can be locked out.
24. As a developer, I want a local docker-compose with Postgres, so that I can run the app locally.
25. As a developer, I want the TypeScript API client generated from an OpenAPI spec, so that the Go/TS boundary is type-checked.
26. As a developer, I want handler-level integration tests, so that login and session behavior is verified end to end.
27. As a developer, I want the old Next.js code removed on a `rewrite` branch, so that the repo has one clear stack.

## Implementation Decisions

- Architecture is recorded in ADR 0001: Go backend, embedded Vite/React SPA, Postgres only, Authentik OIDC with no local auth.
- Domain terms follow `GLOSSARY.md`: User, Startpage, App, Session. v0.1 implements User and Session only.
- Work happens on a `rewrite` branch in the existing repo. The Next.js code is deleted and the branch merges to main when v0.1 works.
- Go stack: stdlib `net/http` router, `pgx`, `sqlc` (no ORM), `goose` migrations, `coreos/go-oidc` with `x/oauth2`.
- Frontend stack: Vite, React, TypeScript, Tailwind, shadcn, TanStack Query. No client router until a second page exists.
- API contract is an OpenAPI spec, with the TypeScript client generated from it.
- The built SPA is embedded in the Go binary and served with long-cache headers on hashed assets. The HTML shell is served so it stays cacheable and revalidates.
- Auth flow: an unauthenticated request to the app redirects to Authentik using the authorization code flow. The callback exchanges the code, validates the ID token, and upserts the User keyed on the OIDC subject, storing the display name from the token claims.
- Sessions: an opaque random ID in an HttpOnly, Secure, SameSite=Lax cookie. The Session row lives in Postgres with a 30-day sliding expiry and can be revoked. Only a hash of the ID is stored.
- API surface for v0.1: an endpoint returning the current User (display name), sign-out, plus the OIDC login and callback routes. An unauthenticated call to the current-user endpoint returns 401 and the SPA triggers the login redirect.
- The SPA caches the current User's display name in localStorage, paints from it immediately, and revalidates via the API after paint.
- Any user Authentik admits is allowed. Access restriction is configured with an Authentik application policy; the app has no group handling.
- Configuration is environment variables only: `DATABASE_URL`, `PUBLIC_BASE_URL`, `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`. The secret is never persisted or logged.
- Startup validates config, runs migrations, performs OIDC discovery, and logs the expected redirect URI. Any failure exits non-zero with a message naming the problem and pointing to the README.
- Postgres is the only database. No SQLite support.
- Deployment: a multi-stage Dockerfile produces one image. Local development uses docker-compose with Postgres.

## Testing Decisions

- A good test exercises external behavior through the HTTP interface and asserts on responses, cookies and resulting state, not on internal functions or SQL.
- The single seam is the HTTP handler layer, running the real server against a real Postgres.
- Authentik is the only faked dependency, via a stub OIDC provider in the test. Postgres is real, started once per `go test` run via testcontainers, with an isolated schema or database per test.
- Covered behaviors: unauthenticated redirect to the provider, successful callback creating a User and Session cookie, second login reusing the same User, current-user returns the display name, expired and revoked Sessions get 401, sign-out invalidates the Session, and startup fails clearly on missing config.
- No unit tests until business logic appears, and no browser end-to-end tests in v0.1.
- Prior art: none in the old Next.js code. This sets the pattern.

## Out of Scope

- Apps, search bar, greeting, weather, calendar link, background image, drag-and-drop ordering, capitalize-names option, and all per-User settings (planned for later versions).
- Shared or household-level themes and configuration.
- A service worker (planned for v0.2). v0.1 relies on HTTP caching plus localStorage.
- Groups or roles, an admin concept, and a first-run setup wizard.
- Local accounts or any password handling.
- Icon resolution and caching, background uploads, weather caching.
- Deployment to the homelab: the Kubernetes chart, CI image build, and an Authentik blueprint are the next task.
- Migrating existing `data/config.json` content.

## Further Notes

- The Authentik provider and application are created manually for v0.1 (about five minutes), documented in the README. A blueprint in the `homelab` repo can replace this later.
- The wizard was considered and rejected because it needs a one-time setup token, secret encryption at rest and an admin role. Revisit it as a new decision if the app is shared beyond the household.
