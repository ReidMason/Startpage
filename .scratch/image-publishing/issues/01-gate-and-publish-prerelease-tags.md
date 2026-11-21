# 01: Gate and publish pre-release tags

**What to build:** Pushing a pre-release tag such as `v4.0.0-rc.1` runs the gate (web build, `go vet`, `go test`) and, only if it passes, builds the `linux/amd64` image from the existing Dockerfile and publishes it to `ghcr.io/reidmason/startpage` as the exact version plus `sha-<short>`, carrying OCI labels. This is the tracer bullet and is verifiable from the `rewrite` branch. See spec.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Pushing `v4.0.0-rc.1` publishes `4.0.0-rc.1` and `sha-<short>`; no `latest`, `4.0` or `4`
- [x] A failing Go vet, Go test or web build publishes nothing (build-and-push needs: gate)
- [ ] Image has OCI source, revision, version and created labels
- [x] Pull requests and non-tag branch pushes do not trigger the workflow (only `push: tags: v*`)
