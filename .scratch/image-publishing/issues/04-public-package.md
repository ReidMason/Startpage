# 04: Public package

**What to build:** The `startpage` ghcr package is public and linked to the repo, so the cluster can pull without an imagePullSecret. Needs one published image first. This is a GitHub setting, not code.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Package visibility is public and linked to the repository
- [ ] An anonymous `docker pull` of a published tag succeeds
