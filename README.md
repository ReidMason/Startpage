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

## Authentik setup

Create these once in the Authentik admin interface.

1. **Applications > Providers > Create > OAuth2/OpenID Provider.**
   - Client type: `Confidential`.
   - Redirect URIs/Origins: strict match on `<PUBLIC_BASE_URL>/auth/callback`, e.g. `https://start.example.com/auth/callback`. The app logs the expected value at startup.
   - Scopes: `openid` and `profile` (the display name comes from the token claims).
   - Pick a signing key so ID tokens are signed.
2. **Applications > Applications > Create.** Set a name and slug (e.g. `startpage`) and select the provider above.
3. Optionally bind a policy or group to the application to restrict who can sign in. The app has no group handling; Authentik decides who is admitted.
4. From the provider page, copy the client ID and client secret into `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET`. Set `OIDC_ISSUER_URL` to the provider's issuer, normally `https://<authentik-host>/application/o/<slug>/`.

Startup exits non-zero naming the problem if a required variable is missing, `PUBLIC_BASE_URL` is not an absolute URL, or OIDC discovery against `OIDC_ISSUER_URL` fails. Check the values against this section.

## Development

```sh
cd web && npm ci && npm run build   # builds the SPA into web/dist for embedding
go test ./...                       # needs Docker (Postgres via testcontainers)
```
