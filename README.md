# Classement

## Purpose

This application aims to manage tierlists by groups of elements in the form of images or texts.
The lists are modifiable and configurable by options or drag'n drop.

Currently 2 modes are possible:

-   Stand-alone: backup mode is in a browser database (IndexedDB).
-   With API: Back on serveur with [PHP](https://git.ikilote.net/classement/serveur).

See `src/environments/environment*.ts` for change.

## Features

-   ✅ Stand-alone (without server)
    -   ✅ Adding images by drag'n drop or copy-paste.
    -   ✅ Adding text under images.
    -   ✅ Possibility to have tiles with only text: copy-paste or drag'n drop of text (One tile per line).
    -   ✅ Advanced customization of tiles, lines, background, etc.
    -   ✅ Image tile:
        -   ✅ Reduce size.
        -   ✅ Changesize.
        -   ✅ Resize.
    -   ✅ Backup in browser or in Json.
        -   ✅ Import / export all
    -   ✅ Image export (PNG, JPG or WebP).
    -   ✅ In-memory tierlists clone.
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
        -   ✅ See personal tierlists
        -   ✅ Remove tierslist
        -   ✅ Change email
        -   ✅ Change password
        -   ✅ Remove user
    -   ✅ Tierlists
        -   ✅ Save tierlists on server
            -   ✅ Public
            -   ✅ Private
            -   ✅ Private with password
        -   ✅ Search in public tierlists
        -   ✅ See tierlists form template
        -   ✅ Tierlist view
    -   ✅ Admin
        -   ✅ Edit profil & change roles
        -   ✅ Tierlists change status
        -   ✅ Remove user
    -   ✅ Contact form

## Demo

[See a demonstration](https://classement.ikilote.net/)

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
