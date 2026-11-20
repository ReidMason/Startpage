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
| `LISTEN_ADDR` | Listen address, default `:8080` |

## Development

```sh
cd web && npm ci && npm run build   # builds the SPA into web/dist for embedding
go test ./...                       # needs Docker (Postgres via testcontainers)
```
