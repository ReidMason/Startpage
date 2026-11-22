# 03: `edge` on `main`

**What to build:** A push to `main` runs the same gate and then publishes `edge` and `sha-<short>`. Only verifiable once `rewrite` merges to `main`. See spec.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A push to `main` publishes `edge` and `sha-<short>` after the gate passes
- [ ] A failing gate leaves `edge` unchanged
- [ ] Pull requests and other branches publish nothing
