# Classement

## Purpose

This application aims to manage tierlists by groups of elements in the form of an image.

Currently only tierlists backup mode is in a browser database (IndexedDB)

## Features

-   ✅ Stand-alone (without server)
    -   ✅ Adding images by drag'n drop or copy-paste
    -   ✅ Adding text under images.
    -   ✅ Possibility to have tiles with only text: copy-paste or drag'n drop of text (One tile per line).
    -   ✅ Advanced customization of tiles, lines, background, etc.
    -   ✅ Backup in browser or in Json.
    -   ✅ Image export (PNG, JPG or WebP).
    -   ✅ In-memory tierlists clone.
-   ⌛ [With server](https://git.ikilote.net/classement/serveur) (in progress)
    -   ⌛ Create user
        -   ✅ Simple create
        -   ❌ Email confirmation
        -   ❌ OAuth connection
        -   ✅ Connection user
        -   ⌛ Password lost
    -   ⌛ Profile
        -   ✅ See personal tierlists
        -   ✅ Remove tierslist
        -   ✅ Change email
        -   ✅ Change password
        -   ⌛ Remove user
    -   ✅ Tierlists
        -   ✅ Save tierlists on server
        -   ✅ Search in public tierlists
        -   ✅ See tierlists form template
    -   ✅ Admin
        -   ✅ Edit profil & change roles
        -   ✅ Tierlists change status
        -   ❌ Remove user

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

## Roadmap

-   Soon
    -   More themes
-   Future
    -   Server save
    -   Account management (server)
    -   Clone a classification (server)
    -   Admin space (client/server)
