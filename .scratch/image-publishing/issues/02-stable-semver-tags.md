# 02: Stable semver tags

**What to build:** Pushing a stable tag `vX.Y.Z` publishes `X.Y.Z`, `X.Y`, `X`, `sha-<short>` and `latest`. Pre-release tags keep publishing only their own version and `sha-<short>`. See spec.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `v4.0.0` publishes `4.0.0`, `4.0`, `4`, `latest` and `sha-<short>`
- [ ] A later `v4.0.1` moves `4.0`, `4` and `latest` to the new image
- [ ] Pre-release tags still never move `latest`, `X.Y` or `X`
