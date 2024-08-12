# Classement

## Purpose

This application aims to manage ranking list by groups of elements in the form of images or texts.
The lists are modifiable and configurable by options or drag'n drop.

Currently 2 modes are possible:

-   Stand-alone: backup mode is in a browser database (IndexedDB).
-   With API: Back on serveur with [PHP](https://git.ikilote.net/classement/serveur).

See `src/environments/environment*.ts` for change.

## Support the project

I'm Zéfling, the main developer on this project. If you want to help me a little to pay for my server which hosts my projects:

<a href='https://ko-fi.com/Z8Z7XW9H2' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

You can also help by contributing, returning bugs or helping with translations.

## Website

Current installation in this [website](https://classement.org/).

### Demo for Tierlist

![Demo for Tierlist](demo/demo_tierlist.webp 'Demo for Tierlist')

### Demo for Bingo selection

![Demo for Bingo selection](demo/demo_bingo.webp 'Demo for Bingo selection')

## Features

-   ✅ Stand-alone (without server)
    -   ✅ Adding images by drag'n drop or copy-paste
    -   ✅ Adding text under images
    -   ✅ Possibility to have tiles with only text: copy-paste or drag'n drop of text (One tile per line)
    -   ✅ Ranking Modes
        -   ✅ Tierlist
        -   ✅ Teams
        -   ✅ Iceberg
        -   ✅ Axis
        -   ✅ Bingo
    -   ✅ Advanced customization of tiles, lines, background, etc.
        -   ✅ Background image
        -   ✅ Direction
    -   ✅ Image tile
        -   ✅ Reduce size
        -   ✅ Change size
        -   ✅ Resize
    -   ✅ Backup in browser or in Json
        -   ✅ Import (one or more)
        -   ✅ Export all
    -   ✅ Image export: PNG, JPG or WebP (except for Safari)
    -   ✅ In-memory rankings clone
    -   ✅ Tags
    -   ✅ Preferences
    -   ✅ External API
        -   ✅ IMDB
        -   ⬜ MAL
-   ✅ [With server](https://git.ikilote.net/classement/serveur) (in progress)
    -   ✅ Create user
        -   ✅ Simple create
        -   ✅ Email confirmation
        -   ✅ Normal connection
        -   ✅ OAuth2 connection
            -   ✅ Discord
            -   ✅ Facebook
            -   ❌ Google (abandoned, the code is not deleted, but impossible to test)
        -   ✅ Password lost
    -   ✅ Profile
        -   ✅ See personal rankings
        -   ✅ Remove ranking
        -   ✅ Change username
        -   ✅ Change email
        -   ✅ Change password
        -   ✅ Change avatar
        -   ✅ Remove user
    -   ✅ rankings
        -   ✅ Save rankings on server
            -   ✅ Public
            -   ✅ Private
            -   ✅ Private with password
        -   ✅ Search in public rankings
        -   ✅ See rankings form template
        -   ✅ Ranking view
            -   ✅ Ranking history
    -   ✅ Admin
        -   ✅ Search users or rankings
        -   ✅ Edit profil & change roles
        -   ✅ rankings change status
        -   ✅ rankings change category
        -   ✅ Remove user
    -   ✅ Contact form

## Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
