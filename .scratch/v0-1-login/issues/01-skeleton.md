# 01: Skeleton: Go server, embedded SPA shell, Postgres and test harness

**What to build:** On a `rewrite` branch, remove the Next.js code and stand up the new foundation. One container image (multi-stage Dockerfile) runs a Go server that serves an embedded Vite/React/shadcn placeholder page, with long-cache headers on hashed assets and a revalidating HTML shell. docker-compose provides Postgres for local development. Migrations (goose) run at startup. A handler-level test harness runs the real server against a real Postgres started once per test run. Follows ADR 0001.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Old Next.js code is removed; repo contains only the new stack
- [ ] `docker compose up` serves the placeholder page from the single image
- [ ] Hashed assets carry long-cache headers; the shell revalidates
- [ ] Migrations apply automatically at startup against Postgres
- [ ] A handler-level test runs against real Postgres via testcontainers and passes
