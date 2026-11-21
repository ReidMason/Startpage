# 09: Remove the prototype

**What to build:** Once the real UI exists, delete the throwaway `/proto` prototype (both variants) and the switch that routes to it, so the codebase has one implementation.

**Blocked by:** 02, 03, 04, 06, 07, 08

**Status:** resolved

- [ ] The prototype components and the `/proto` route switch are removed
- [ ] Nothing in the real app imports from the prototype
- [ ] Dependencies added for the prototype and still used by the real UI are kept; unused ones are removed
- [ ] The app builds and typechecks
