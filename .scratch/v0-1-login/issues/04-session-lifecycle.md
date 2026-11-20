# 04: Session lifecycle: sliding expiry, sign-out, revocation

**What to build:** Sessions slide their 30-day expiry on use. Expired or revoked Sessions get 401. Sign-out invalidates the Session and clears the cookie. A Session can be revoked so a lost device is locked out.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Using a Session extends its expiry
- [ ] Expired Sessions get 401
- [ ] Revoked Sessions get 401
- [ ] Sign-out invalidates the Session and clears the cookie
- [ ] Handler-level tests cover expiry, revocation and sign-out
