# 03: Delete with undo

**What to build:** Deleting an App from the modal removes it immediately and shows an Undo toast for a few seconds. Delete is a soft delete, so Undo restores the App to its original Group and position and the data is kept for a future recycle bin.

**Blocked by:** 02

**Status:** resolved

- [ ] Delete takes effect immediately with no confirm prompt and is independent of Save
- [ ] A deleted App no longer appears in the Startpage response
- [ ] The Undo toast restores the App to its original Group and position, shifting siblings as needed
- [ ] Delete and restore endpoints are in the OpenAPI spec with integration tests, including per-User isolation
