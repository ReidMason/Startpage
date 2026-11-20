# Startpage

Self-hosted browser new-tab page. Go backend serving an embedded Vite/React SPA, Postgres for storage. See `docs/adr/0001-go-spa-postgres-authentik.md`.

## Run locally

```sh
docker compose up --build
```

Then open <http://localhost:8080>.

## Configuration

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (required) |
| `PUBLIC_BASE_URL` | Externally visible base URL, e.g. `https://start.example.com` (required). The OIDC redirect URI is `<PUBLIC_BASE_URL>/auth/callback`, logged at startup |
| `OIDC_ISSUER_URL` | OIDC issuer URL; discovery runs at startup (required) |
| `OIDC_CLIENT_ID` | OIDC client ID (required) |
| `OIDC_CLIENT_SECRET` | OIDC client secret; never logged or stored (required) |
| `LISTEN_ADDR` | Listen address, default `:8080` |

## Development

```sh
cd web && npm ci && npm run build   # builds the SPA into web/dist for embedding
go test ./...                       # needs Docker (Postgres via testcontainers)
```
