# 04: Session lifecycle: sliding expiry, sign-out, revocation

**What to build:** Sessions slide their 30-day expiry on use. Expired or revoked Sessions get 401. Sign-out invalidates the Session and clears the cookie. A Session can be revoked so a lost device is locked out.

**Blocked by:** 03

**Status:** resolved

- [x] Using a Session extends its expiry
- [x] Expired Sessions get 401
- [x] Revoked Sessions get 401
- [x] Sign-out invalidates the Session and clears the cookie
- [x] Handler-level tests cover expiry, revocation and sign-out
