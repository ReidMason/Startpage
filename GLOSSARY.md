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
A named link on a Startpage, with a URL, icon and enabled flag.
_Avoid_: Bookmark, shortcut, link

**Session**:
A signed-in browser's long-lived, revocable authorisation to act as a User.
_Avoid_: Login, token
