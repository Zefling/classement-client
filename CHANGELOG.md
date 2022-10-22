# Changelog - Standalone web app & API

## 1.2.0 (2022-10-22)

### With API activited only

-   add change date #9
-   make a empty derivatives #10
-   add popup with all "my derivatives"
-   change URL of tierlist on save if id change
-   review all buttons on page view

## 1.1.3 (2022-10-22)

### Standalone web app

-   fix tile title color with annotation
-   fix tile title position without image
-   fix background preview

### With API activited only

-   remove url for tile with no image

## 1.1.2 (2022-10-18)

### Standalone web app

-   fix title width in tile when “automatic tile width” is activated
-   improve langage FR & EN (Thanks Ambroise Croizat)

### With API activited only

-   fix crash when canceling Oauth authentication
-   fix on save tierlist

## 1.1.1 (2022-10-16)

### With API activited only

-   fix image render

## 1.1.0 (2022-10-16)

### Standalone web app

-   add import / export all #8
-   add annotation #7
-   add maxlength for textarea
-   improve dark mode

### With API activited only

-   rewrite navigation
-   add page preview #3
-   better visibility for personnal derivatives

## 1.0.1 (2022-10-11)

### Standalone web app

-   fix group naming

### With API activited only

-   fix email validation

## 1.0.0 (2022-10-09)

### Standalone web app

-   improve group naming
    -   added support for line breaks
    -   autoresize instead of scrollbar

### With API activited only

-   add an expiration days for cookies
-   do not show advanced options on open
-   improve textarea with autoresize (contact page)
-   fix loading issues in navigate
-   fix auto login
-   show hidden tierlist for current user

## 0.9.22 beta (2022-09-25)

### Standalone web app

-   do not show advanced options on open

### With API activited only

-   do not load personal derivative when not connected

## 0.9.21 beta (2022-09-24)

### With API activited only

-   improve navigation cards
-   add icons
-   fix when text is pasted in textarea

## 0.9.20 beta (2022-09-23)

### With API activited only

-   improve create account form
-   improve password lost form
-   fix a possible password leak with Chrome and Edge
-   update texts

## 0.9.19 beta (2022-09-20)

### Standalone web app

-   fix image render

## 0.9.18 beta (2022-09-18)

### With API activited only

-   add the different tiles of derivative
-   improve list “my derivative” on edit page
-   add search by template and userId

## 0.9.17 beta (2022-09-17)

### Standalone web app

-   fix scrolling top when changing page

### With API activited only

-   add list “my derivative” on edit page
-   fix css
-   improve texts

## 0.9.16 beta (2022-09-17)

### With API activited only

-   fix update profile on save
-   fix update rankings list on change
-   fix navigation design
-   fix derivative button on save

## 0.9.15 beta (2022-09-13)

### Standalone web app

-   add link to template in ranking edit

### With API activited only

-   fix options interface
-   fix css

## 0.9.14 beta (2022-09-11)

### With API activited only

-   add counters in navigation results
-   fix navigation result order
-   fix first save ranking

## 0.9.13 beta (2022-09-09)

### Standalone web app

-   add more categories
-   improve responsive display

## 0.9.12 beta (2022-09-09)

### Standalone web app

-   fix double optimization error
-   fix CSS

### With API activited only

-   add share button
-   add icons
-   improve upload rendering

## 0.9.11 beta (2022-09-08)

### Standalone web app

-   refacto CSS

### With API activited only

-   add progressbar for tierlist save
-   fix bad initialization for image cropper

## 0.9.10 beta (2022-09-07)

### Standalone web app

-   add global laoder
-   add loading in edit page

### With API activited only

-   improve loading in admin pages
-   fix CORS for Chromium
-   Google OAuth2 connection temporarily hidden

## 0.9.9 beta (2022-09-06)

### Standalone web app

-   improve responsive display

### With API activited only

-   add laoder on navige page

## 0.9.8 beta (2022-09-05)

### With API activited only

-   fix image render with https images (fix the type mine)

## 0.9.7 beta (2022-09-04)

### Standalone web app

-   add enlarge et fullscreen modes
-   add a link to the changelog
-   implement a log service
-   fixed theme change (do not overwrite: title, category, autoSave, itemWidthAuto)

### With API activited only

-   fix image render with https images

## 0.9.6 beta (2022-09-04)

### Standalone web app

-   fix saving if an edit and replace with "new"

### With API activited only

-   fix connection if never connected

## 0.9.5 beta (2022-09-03)

### Standalone web app

-   add navigation in home page

## 0.9.4 beta (2022-09-03)

### Standalone web app

-   add `titleTextColor` option
-   option opacity change to input range
-   reduce default padding for tiles
-   show “Automatic tile width” all the time
-   improve rendre for input toggle
-   fix minor bugs

## 0.9.3 beta (2022-09-02)

### With API activited only

-   improve the rendering of roles and statuses in the admin

## 0.9.2 beta (2022-09-01)

### Standalone web app

-   fix minor bugs

## 0.9.1 beta (2022-08-31)

### Standalone web app

-   block save when empty
-   fix import json
-   fix light-dark mode

### With API activited only

-   add loading on save

## 0.9.0 beta (2022-08-30)

### Standalone web app

-   update to Angular `14.2`
-   add auto save
-   add an API switch in the environment configuration

### With API activited only

-   sign up / login / oauth
    -   Discord
    -   Facebook
    -   Google
-   profil management
-   save tierlists with account
-   search/browse tierslists on server
-   admin pages management: users / tierlists
-   contact

# Changelog - Standalone web app

## 0.5.5 (2022-06-09)

-   drop content in all the page

## 0.5.4 (2022-06-03)

-   update to Angular `14.0`
-   fix minor css bugs

## 0.5.3 (2022-05-15)

-   add import in list page
-   block page reload in edit mode
-   fix minor bugs

## 0.5.2 (2022-04-16)

-   fix import (decode UTF-8)

## 0.5.1 (2022-04-16)

-   fix import

## 0.5.0 (2022-04-15)

-   add auto tile width
-   add text position in tiles
-   add options for tile text
-   change the interface of advanced options
-   fix minor bugs

## 0.4.3 (2022-04-11)

-   change demo path: https://classement.ikilote.net/
-   add japanese
-   fix minor bugs

## 0.4.2 (2022-04-08)

-   add the sky theme

## 0.4.1 (2022-04-06)

-   add page for third-Party licenses
-   fix copy/paste in input
-   change favicon

## 0.4.0 (2022-04-06)

-   add text below the image or just text
-   Add text for the drop (one tile per line)
-   copy/paste images or text (one tile per line)

## 0.3.0 (2022-04-03)

-   add image optimization dialog (with pica)
-   update Angular to version `~13.3.0`

## 0.2.1 (2022-03-29)

-   add the “night” theme
-   add group name background opacity
-   fix rendering with Chromium browsers
-   fix minor bugs

## 0.2.0 (2022-03-28)

-   add theme selection
-   add SVG background images
-   fix minor bugs and code refactoring

## 0.1.4 (2022-03-25)

-   add clear bouton
-   add message for infos, successes or errors

## 0.1.3 (2022-03-22)

-   add options for group name sizes
-   fix minor bugs

## 0.1.2 (2022-03-21)

-   add options for final image background color and size
-   change options UI
-   fix minor bugs

## 0.1.1 (2022-03-18)

-   add json import and export (import and replace / import and new)
-   predefine files for input:file
-   fix minor bugs

## 0.1.0 (2022-03-16)

-   add tiles for add images
-   tablet and mobile interface (for testing)
-   remove `/classement` in routes
-   fix minor bugs

## 0.0.7 (2022-03-13)

-   add option to clone classifications
-   fix dark/light via cookie
-   fix minor bugs

## 0.0.6 (2022-03-12)

-   buttons to save the generated image: PNG, Jpeg or WebP
-   warning popup on change
-   fix minor bugs

## 0.0.5 (2022-03-11)

-   better options render
-   fix light theme
-   fix id for new classification
-   fix opacity
-   fix wording

## 0.0.4 (2022-03-10)

-   add advendced options: more sizes and colors
-   change dark/light button.
-   fix wording

## 0.0.3 (2022-03-06)

-   add dark mode.
-   change color selector buttons.
-   more categories.

## 0.0.2 (2022-03-06)

-   fix drag'n drop size and alignment.
-   added warning on deletion.
-   button design.

## 0.0.1 (2022-02-27)

-   initial version.
