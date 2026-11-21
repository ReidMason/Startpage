Status: resolved

# Apps and Groups: display and in-place editing

## Problem Statement

The Startpage currently shows nothing but a User's name. The old startpage showed a flat grid of Apps, but editing needed an edit toggle and hover buttons that were easy to trigger by accident while just trying to open an App. It also had no way to keep rarely-used homelab services pinned without crowding the daily ones. I want every App visible immediately on load, a way to organise Apps into Groups without the page getting cluttered, and an editing experience that can't be triggered accidentally and lets me see the real layout while I change it.

## Solution

The Startpage shows the User's Apps as a read-only grid of big-icon tiles, organised into named Groups. The first Group is unlabelled, so a one-Group Startpage looks like the old view. Later Groups have a muted label and can be collapsed. Each Group is shown as big tiles or compact rows.

Editing is a single explicit mode toggled by an "Edit" button at the bottom left (it becomes "Done"). In edit mode the page itself is the editor:
- Tiles can be dragged to reorder or move between Groups.
- Groups can be dragged by a handle to reorder, renamed inline, and switched between tiles and compact.
- Each Group has an "Add app" tile, and there is an "Add group" control.
- Clicking a tile opens a shared add/edit modal for name, URL, icon and delete, with Save and Cancel.
- A Settings drawer docked on the left (weather, appearance and future settings) pushes the page over and stays open for the whole edit session.

Deleting an App is instant with an undo toast, backed by a soft delete so a recycle bin can be added later.

A visual prototype of this design (the inline variant) was built and approved; it is the reference for look and interaction. An earlier drawer-only variant was rejected because swapping the drawer to an App form lost the Settings context and hid the layout being edited.

## User Stories

1. As a User, I want all my Apps visible on page load with no clicks, so that I can reach any of them immediately.
2. As a User, I want Apps shown as big icon tiles with name and domain, so that I can scan and recognise them quickly.
3. As a User, I want my Apps in an order I control, so that the most used ones sit where I expect them.
4. As a User, I want to group Apps into named Groups, so that rarely-used Apps stay pinned without crowding daily ones.
5. As a User, I want the first Group to have no label, so that a simple Startpage looks as minimal as the old one.
6. As a User, I want later Groups to have a small muted label, so that I can tell them apart without visual clutter.
7. As a User, I want to collapse and expand a Group by clicking its label, so that I can hide Groups I don't need right now.
8. As a User, I want the collapse chevron to appear only when I hover a Group label, so that the page stays minimal.
9. As a User, I want a Group's collapsed state remembered, so that the page looks the same next time I open it.
10. As a User, I want every Group expanded on first use, so that nothing is hidden by default.
11. As a User, I want to choose big tiles or compact rows per Group, so that bulk or secondary Apps take less space.
12. As a User, I want the grid to be read-only, so that I can never move or edit an App by accident while clicking it.
13. As a User, I want clicking an App to open its URL, so that the grid works as a launcher.
14. As a User, I want a single "Edit" button at the bottom left that becomes "Done", so that there is one obvious, explicit way in and out of editing.
15. As a User, I want to see my real page layout while editing, so that I can judge how my changes look as I make them.
16. As a User, I want to drag Apps to reorder them within a Group, so that I can control their order.
17. As a User, I want to drag an App to another Group, including an empty one, so that I can reorganise my Startpage.
18. As a User, I want to drag a Group by a handle to reorder Groups, so that I can control Group order without affecting the Apps in them.
19. As a User, I want to add a new Group while editing, so that I can create places for new categories of Apps.
20. As a User, I want to rename a Group inline, so that I can fix or change its label.
21. As a User, I want an "Add app" tile at the end of each Group, so that I can pin a new service in exactly the Group I want.
22. As a User, I want clicking a tile in edit mode to select it instead of opening its URL, so that I can edit without navigating away.
23. As a User, I want a modal to edit an App's name and URL, so that I can correct or update it without losing my place on the page.
24. As a User, I want the same modal for adding and editing, so that both feel identical.
24a. As a User, I want changes in the modal committed only when I press Save, so that I can back out of a half-finished edit.
24b. As a User, I want Cancel (or closing the modal) to discard my changes, so that a mistaken edit never reaches my Startpage.
24c. As a User, I want cancelling a new App to leave nothing behind, so that abandoned "New app" tiles don't litter my page.
25. As a User, I want a Settings drawer docked on the left during edit mode, so that I can change weather and appearance settings in one place.
26. As a User, I want the drawer to push the page over rather than cover it, so that I can still see the page while changing settings.
27. As a User, I want editing an App to leave the Settings drawer untouched, so that I never lose my place in settings.
25. As a User, I want to search Iconify's icon library by keyword while editing an App, so that I can find a good icon from a broad selection.
26. As a User, I want to see the chosen icon update live in the form, so that I know what I'm picking.
27. As a User, I want the chosen icon stored with the App, so that icons render instantly on every new tab without waiting on the network.
28. As a User, I want to delete an App instantly, so that removal isn't tedious.
29. As a User, I want an Undo toast after deleting, so that a mis-click is recoverable.
30. As a User, I want an undone App returned to its original Group and position, so that undo leaves everything as it was.
31. As a User, I want deleted Apps kept rather than destroyed, so that a recycle bin can be added later.
32. As a User, I want my Apps and Groups to paint instantly on repeat visits, so that a new tab feels fast.
33. As a User, I want the Startpage refreshed in the background after first paint, so that changes made on another device show up.
34. As a User, I want my changes saved automatically as I make them, so that I never lose an edit.
35. As a household member, I want my Apps and Groups separate from everyone else's, so that our pages never interfere.
36. As a new User, I want a usable empty Startpage with an unlabelled first Group on first sign-in, so that I can start adding Apps straight away.
37. As a User, I want an App's URL entered without a scheme to still work, so that I can type just `plex.example.com`.
38. As a developer, I want the Apps and Groups API described in the OpenAPI spec with a generated client, so that the Go and TypeScript boundary is type-checked.

## Implementation Decisions

- Domain terms follow `GLOSSARY.md`: **App**, **Group**, **Startpage**, **User**. An App has a name, a URL and an Iconify icon, and has no enabled or disabled state. Removal is a soft delete.
- Architecture follows ADR 0001: Go backend, embedded SPA, Postgres only. First paint must not wait on a server round trip.
- Data model:
  - A Group belongs to a User and has a name, an ordering position, a style (tiles or compact), and a collapsed flag.
  - An App belongs to a Group and has a name, a URL, an icon name, the icon's SVG body, an ordering position within its Group, and a deleted-at timestamp (null while live).
  - A deleted App keeps its Group and position so it can be restored in place.
  - Every query is scoped to the signed-in User; one User can never read or write another's Apps or Groups.
- Icons: the SPA searches the public Iconify search API directly while editing. When an icon is chosen, its SVG body is fetched and sent to the backend with the icon name, and the backend stores both. Display renders from the stored SVG, so no Iconify call happens on page load. Search is only available while online.
- API contract (all authenticated, all in the OpenAPI spec):
  - A read endpoint returns the whole Startpage in one response: Groups in order, each with its live Apps in order.
  - Create, update and delete endpoints for Apps. Update covers name, URL and icon. Delete sets deleted-at. A restore operation clears it and reinstates the App at its stored Group and position, shifting siblings as needed.
  - Create and update endpoints for Groups, covering name, style and collapsed state.
  - A single reorder operation takes the full desired arrangement (Group order, and each Group's App order) and applies it atomically. The SPA sends this after each drag, so moving between Groups and reordering are the same call.
- Group deletion is not part of this spec (see Out of Scope).
- On first sign-in, a User gets one empty Group created lazily. The first Group is always rendered without a label. A new App defaults to the first Group.
- URLs are stored as entered. The display shows the host and path without the scheme, and the link opens with `https://` prepended when no scheme is present.
- Group collapsed state is stored on the Group server-side, so it is remembered per User across devices. All Groups default to expanded.
- Frontend:
  - The SPA caches the last Startpage response in localStorage, paints from it immediately, and revalidates after first paint, mirroring how the display name already works.
  - The grid is purely presentational: no hover controls, no drag, no edit affordances.
  - Edit mode is a client-side toggle. In it the page renders an editable layout: draggable tiles, draggable Groups (by a handle, kept separate from tile drags so the two don't interfere), inline Group name and style controls, an "Add app" tile per Group and an "Add group" control.
  - A shared modal handles creating and editing an App (name, URL, icon search, delete). Selecting a tile opens it, and a drag must not also register as a click. The modal edits a local draft; nothing is sent to the API until Save. Save creates (for a new App, appended to the chosen Group) or updates the App. Cancel, Escape and clicking outside discard the draft, so a new App that is cancelled is never created. Delete inside the modal is immediate with the Undo toast, independent of Save.
  - A Settings drawer is docked on the left, only in edit mode, and pushes the page over. It stays on the Settings view for the whole session. The Settings contents themselves (weather key and so on) are built by later specs; this spec delivers the drawer shell only.
  - Edits are saved as they are made, with optimistic updates in the UI and TanStack Query for mutations.
  - Drag and drop for tiles and Groups uses dnd-kit and icons use `@iconify/react`, both already proven in the prototype.
  - Layout is desktop-only (4-column tile grid); no mobile or touch layout work.
  - The prototype's visual styling (dark theme, large icons, muted Group labels) is the reference. The prototype itself is throwaway and its state handling is not carried over.

## Testing Decisions

- A good test exercises external behavior through the HTTP interface and asserts on responses and resulting state, not on internal functions or SQL.
- The single seam is the existing HTTP handler layer, running the real server against a real Postgres via testcontainers with the stub OIDC provider. This is the pattern already in the server package's tests.
- Covered behaviors:
  - a new User's Startpage has one empty first Group;
  - creating, editing and listing Apps and Groups returns them in order;
  - a new App lands in the first Group;
  - reordering within a Group, moving an App to another Group (including an empty one), and reordering Groups each persist correctly;
  - deleting an App removes it from the Startpage response, and restoring returns it to its original Group and position;
  - collapsed state and style persist;
  - one User cannot see or modify another User's Apps or Groups;
  - unauthenticated requests get 401.
- No unit tests, since there is no complex business logic. No frontend or browser tests; edit mode is verified manually against the prototype.
- Prior art: the handler-level tests for login and sessions.

## Out of Scope

- Deleting Groups and the recycle-bin UI. Soft delete is built now; restoring beyond the immediate Undo toast comes later.
- Mobile and touch layout.
- The actual Settings contents (weather key, appearance); only the drawer shell is in scope here.
- Search bar, greeting, weather and other Startpage content, which are handled separately.
- Importing Apps from the old `config.json`.
- Uploading custom icons or fetching favicons.
- Keyboard shortcuts for entering edit mode.
- Per-App enabled/disabled state (deliberately not a concept).
- Offline icon search.

## Further Notes

- Open question for the Group-deletion follow-up: the simplest rule is that only empty Groups can be deleted. This was not discussed, so it is left out here.
- The prototype (`web/src/proto/` and its `/proto` switch in the SPA entry file) has been removed now that the real implementation has landed.
- The prototype saves edits live with no Save or Cancel; the real modal must use a draft with Save/Cancel as specified above.
- `GLOSSARY.md` already reflects the App definition change and the new Group term.
