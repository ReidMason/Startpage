# 01: Filter mode: flat ranked results

**What to build:** Typing `/` followed by at least one character in the search bar puts the Startpage in Filter mode. The Groups are replaced by one flat grid of big tiles, ranked best match first by fuzzy name match (fzf-style, case-insensitive, weak matches hidden, ties in page order). A bare `/` keeps the grouped layout. Deleting the `/` restores the full page. When nothing matches, the page shows "No matching apps". Apps in collapsed Groups still appear, and collapse state is untouched. Enter in the bar is unchanged for now. This slice introduces Vitest as the first frontend test tooling, the `fzf` package, and the pure ranking function the grid uses.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Vitest is set up with a script to run it, and the ranking function has unit tests through its public interface
- [ ] Tests cover case-insensitivity, abbreviation matching, non-matches hidden, best match first, ties in page order, and Apps from different Groups ranked together
- [ ] `/` plus one or more characters replaces the Groups with a flat grid of big tiles, with no Group headers
- [ ] Results are ordered best match first
- [ ] A bare `/` leaves the normal grouped layout in place
- [ ] Deleting the `/` restores the grouped layout exactly as before, including collapse state
- [ ] Apps inside collapsed Groups appear in results
- [ ] "No matching apps" shows when nothing matches
- [ ] Matching is on App names only
- [ ] Weak matches are hidden by a score cutoff tuned against realistic App names
- [ ] The `fzf` package's bundle size, licence and maintenance have been checked
