# Startpage

Self-hosted browser new-tab page. Go backend serving an embedded Vite/React SPA, Postgres for storage. See `docs/adr/0001-go-spa-postgres-authentik.md`.

## Run locally

Set up the Authentik provider first (see [Authentik setup](#authentik-setup)). Use `http://localhost:8080/auth/callback` as the redirect URI.

Create a `.env` file (git-ignored) next to `docker-compose.yml`:

```sh
OIDC_ISSUER_URL=https://auth.example.com/application/o/startpage/
OIDC_CLIENT_ID=...
OIDC_CLIENT_SECRET=...
```

Then:

```sh
docker compose up --build
```

Open <http://localhost:8080>. `PUBLIC_BASE_URL` defaults to `http://localhost:8080`; override it in `.env` if you change the port.

## Configuration

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (required) |
| `PUBLIC_BASE_URL` | Externally visible base URL, e.g. `https://start.example.com` (required). The OIDC redirect URI is `<PUBLIC_BASE_URL>/auth/callback`, logged at startup |
| `OIDC_ISSUER_URL` | OIDC issuer URL; discovery runs at startup (required) |
| `OIDC_CLIENT_ID` | OIDC client ID (required) |
| `OIDC_CLIENT_SECRET` | OIDC client secret; never logged or stored (required) |
| `LISTEN_ADDR` | Listen address, default `:8080` |

## Authentik setup

Create these once in the Authentik admin interface.

1. **Applications > Providers > Create > OAuth2/OpenID Provider.**
   - Client type: `Confidential`.
   - Redirect URIs/Origins: strict match on `<PUBLIC_BASE_URL>/auth/callback`, e.g. `https://start.example.com/auth/callback`. The app logs the expected value at startup.
   - Also add `<PUBLIC_BASE_URL>/` as a post-logout redirect URI (strict match) so Sign out can end the Authentik session and return here.
2. **Applications > Applications > New Application dropdown > With existing provider.** Set a name and slug (e.g. `startpage`) and select the provider above.
3. Optionally bind a policy or group to the application to restrict who can sign in. The app has no group handling; Authentik decides who is admitted.
4. From the provider page, copy the client ID and client secret into `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET`. Set `OIDC_ISSUER_URL` to the provider's issuer, normally `https://<authentik-host>/application/o/<slug>/`.

Startup exits non-zero naming the problem if a required variable is missing, `PUBLIC_BASE_URL` is not an absolute URL, or OIDC discovery against `OIDC_ISSUER_URL` fails. Check the values against this section.

## Development

```sh
cd web && pnpm install && pnpm build   # builds the SPA into web/dist for embedding
go test ./...                       # needs Docker (Postgres via testcontainers)
```

Run the Go server against the compose Postgres, with the SPA hot-reloading:

```sh
docker compose up -d postgres
export DATABASE_URL=postgres://startpage:startpage@localhost:5432/startpage?sslmode=disable
export PUBLIC_BASE_URL=http://localhost:8080
export OIDC_ISSUER_URL=... OIDC_CLIENT_ID=... OIDC_CLIENT_SECRET=...
go run ./cmd/startpage              # API and built SPA on :8080
cd web && pnpm dev                   # Vite on :5173, proxies /api and /auth to :8080
```

Regenerate the TypeScript API client after editing `api/openapi.yaml` with `pnpm generate` in `web/`, and the database code after editing migrations or queries with `sqlc generate`.

## Roadmap

- Evaluate release-please for automated release tagging: `.scratch/image-publishing/issues/05-evaluate-release-please.md`
