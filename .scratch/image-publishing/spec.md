Status: ready-for-agent

# Image publishing: build and push the Startpage container to ghcr

## Problem Statement

The rewritten Startpage has a Dockerfile but no automated way to turn commits into a deployable image. I have to build and push by hand, there is no versioning scheme, and nothing stops a broken commit from becoming the image the homelab pulls.

## Solution

A GitHub Actions workflow tests the code, then builds the image and pushes it to `ghcr.io/reidmason/startpage`. Merges to `main` publish a rolling `edge` image. Pushing a `vX.Y.Z` git tag publishes semver-tagged images. Pull requests and other branches never publish.

## User Stories

1. As the maintainer, I want every merge to `main` to publish an `edge` image, so that I can always run the newest merged code.
2. As the maintainer, I want every published image to carry a `sha-<short>` tag, so that I can pin or roll back to an exact commit.
3. As the maintainer, I want pushing `vX.Y.Z` to publish `X.Y.Z`, `X.Y`, `X` and `latest`, so that consumers can choose how tightly to pin.
4. As the maintainer, I want pre-release tags like `v4.0.0-rc.1` to publish only their own tag, so that testing a release never moves `latest`, `X.Y` or `X`.
5. As the maintainer, I want to exercise the pipeline from the `rewrite` branch with a pre-release tag, so that I can verify it before `rewrite` merges to `main`.
6. As the maintainer, I want the image to be built only after Go vet, Go tests and the web build pass, so that a broken commit never becomes `edge` or a release.
7. As the maintainer, I want pull requests and non-`main` branches to publish nothing, so that the registry only holds merged or deliberately tagged code.
8. As the maintainer, I want the image to be public, so that the cluster can pull it without an imagePullSecret.
9. As the maintainer, I want the image to carry OCI labels (source repo, revision, version, created), so that the package links to the repo and any image can be traced to its commit.
10. As the maintainer, I want a `linux/amd64` image, so that it runs on the homelab nodes.
11. As the maintainer, I want the first release of the rewrite to be `v4.0.0`, so that it is clearly a breaking change from the old `v3.0.0`.
12. As the maintainer, I want `latest` published from the first stable tag, so that the rewrite is the default image once it is deployable.
13. As a homelab operator, I want to pin an exact version such as `4.1.0`, so that Renovate can open bump PRs and Argo CD sees every change.
14. As the maintainer, I want repeat builds to reuse cached layers, so that pushes to `main` are fast.
15. As the maintainer, I want a recorded follow-up to evaluate release-please, so that I can automate tagging later if manual tags become tedious.

## Implementation Decisions

- One GitHub Actions workflow in the Startpage repo with two jobs: a gate job and a build-and-push job that depends on it.
- Triggers: push to `main`, and push of tags matching `v*`. No pull request trigger and no manual trigger.
- Gate job: builds the web app first (the Go server embeds the built SPA, so Go commands need `web/dist`), then runs `go vet ./...`, `go test ./...` and the web build, which type-checks via `tsc`. Go version comes from `go.mod`; pnpm store is cached. The Go tests start Postgres via testcontainers, so the runner needs Docker (standard on GitHub-hosted Ubuntu runners). No new lint tooling.
- Build-and-push job: Buildx, login to ghcr with the workflow `GITHUB_TOKEN` (packages: write), build from the existing multi-stage Dockerfile, `linux/amd64` only, GitHub Actions layer cache.
- Tags and labels come from `docker/metadata-action`:
  - `main` push: `edge`, `sha-<short>`.
  - Stable tag `vX.Y.Z`: `X.Y.Z`, `X.Y`, `X`, `sha-<short>`, `latest`.
  - Pre-release tag `vX.Y.Z-suffix`: the exact version and `sha-<short>` only; no `latest`, `X.Y` or `X`.
- `latest` is enabled only on stable tags. It replaces the old app's `latest`; this is accepted because the first stable tag is pushed only when the rewrite is deployable.
- A tag builds whatever commit it points at; there is no check that the commit is on `main`. Pre-release tags on `rewrite` are the pre-merge test path.
- Because the `main` trigger cannot fire until `rewrite` merges, `edge` is first exercised after merge; the rc tag exercises everything else before that.
- Package is `ghcr.io/reidmason/startpage` (same name as the old app; `4.x` tags distinguish it from `3.x`), set public.
- Versioning is manual semver git tags; first rewrite release is `v4.0.0`.
- Provenance and SBOM attestations are not enabled.
- A README line points to a local issue for evaluating release-please.

## Testing Decisions

- A good check here exercises external behaviour: which tags appear in ghcr after a given git event. It does not assert on workflow internals.
- Single seam: a pushed git tag (and later a `main` push) checked against the published ghcr tags.
  - Push `v4.0.0-rc.1` from `rewrite`: gate passes, image publishes as `4.0.0-rc.1` and `sha-*`, with no `latest`, `4.0` or `4`.
  - After merge, a `main` push publishes `edge` and `sha-*`.
- The gate job reuses the existing Go integration tests and the web build; no new tests are written.
- No prior art for workflows in this repo; there is no existing `.github/workflows`.

## Out of Scope

- Any change to the homelab repo (chart, values, Argo CD, ingress, Postgres, Authentik secrets); it is read-only context.
- Multi-arch images, image attestations, lint tooling, pull request builds.
- Automated release tooling (release-please), tracked separately.
- A dev environment image tracking strategy.
- Retiring the old `kubernetes/startpage` deployment.

## Further Notes

- Floating tags (`4`, `4.1`, `edge`) do not trigger Kubernetes or Argo CD to redeploy. Prod should pin an exact version and let Renovate bump it.
- The repo already has a `v3.0.0` tag from the old app.
