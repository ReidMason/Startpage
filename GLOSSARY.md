# Startpage

A self-hosted browser new-tab page where each household member has their own personalised page behind a shared login.

## Language

**User**:
A person who signs in through Authentik and owns exactly one Startpage.
_Avoid_: Account, member, profile

**Startpage**:
A User's personal page: their Apps, search, greeting, weather and appearance settings. Fully independent from every other User's.
_Avoid_: Dashboard, homepage, config

**App**:
A named link on a Startpage, with a URL and an Iconify icon. Removing one soft-deletes it so it can later be recovered.
_Avoid_: Bookmark, shortcut, link, disabled

**Group**:
A named, ordered, collapsible set of Apps on a Startpage, shown as big tiles or compact rows. The first Group is unlabelled.
_Avoid_: Section, folder, category

**Session**:
A signed-in browser's long-lived, revocable authorisation to act as a User.
_Avoid_: Login, token

**Setting**:
A per-User preference on a Startpage, changed from the Settings drawer in edit mode.
_Avoid_: Option, preference, config

**Search engine**:
The web search a Startpage's search bar sends queries to, chosen by the User from presets or entered as a custom address.
_Avoid_: Provider, search URL

**Filter mode**:
What the search bar does when its query starts with `/`: the Startpage narrows to Apps matching the rest of the query instead of going to the Search engine.
_Avoid_: Command mode, quick find
