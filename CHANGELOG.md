# Changelog - Standalone web app & API

## 1.9.1 (2023-05-14)

### Standalone web app

-   fix typo
-   fix color un light mode

## 1.9.0 (2023-05-14)

### Standalone web app

-   update to Angular `16.0`
-   add preferences dialog #34
-   add tags for tierlist #31

### With API activited only

-   add avatar for user profile #19
-   required: API `1.0.9`

## 1.8.3 (2023-04-28)

### Standalone web app

-   fix banner with local save

### With API activited only

-   fix links for history lierlist

## 1.8.2 (2023-04-23)

### With API activited only

-   fix history

## 1.8.1 (2023-03-28)

### Standalone web app

-   fix font size for group title

### With API activited only

-   fix sharing in editing

## 1.8.0 (2023-03-26)

### With API activited only

-   add history feature #33
-   required: API `1.0.8`

## 1.7.3 (2023-03-11)

### Standalone web app

-   update to Angular `15.2`
-   add total size in edit page
-   fix big images in edit tile dialog
-   fix error in console

## 1.7.2 (2023-02-08)

### Standalone web app

-   fix ratio calculate in image edit

## 1.7.1 (2023-02-08)

### Standalone web app

-   fix ratio field in image edit

## 1.7.0 (2023-02-05)

### Standalone web app

-   fix memory overflow crash with json too heavy
-   add modify, replace and delete images for tiles

## 1.6.1 (2022-12-28)

### Standalone web app

-   fix background selection

### With API activited only

-   fix custom background on render

## 1.6.0 (2022-12-28)

### Standalone web app

-   image drop/copy in save dialog #32
-   add custom background image #5
-   change advanced options interface
-   change URLs without reload the current tierlist

### With API activited only

-   fix propagation of ids between client and server
-   required: API `1.0.7`

## 1.5.4 (2022-12-04)

### Standalone web app

-   `itemWidthAuto:true` by default

### With API activited only

-   fix export image when not logged.

## 1.5.3 (2022-11-22)

### Standalone web app

-   add backdrop filter

### With API activited only

-   fix loading tiles on homepage
-   don't load unnecessary images

## 1.5.2 (2022-11-21)

### Standalone web app

-   update to Angular `15.0`

## 1.5.1 (2022-11-16)

### Standalone web app

-   fix id when fork
-   add a dialog to prevent errors when clicking on Clear Groups

## 1.5.0 (2022-11-11)

### Standalone web app

-   tierlist edit
    -   fix line title heigth
    -   add description field #25
-   homepage
    -   remove an unnecessary title
    -   add link to icon font source
-   personnal lists:
    -   add a new directive to sort tables #21
    -   add filter on personal lists #21
    -   fix responsive for actions
-   change menu order
-   set language on HTML tag
-   fix dialog input position

### With API activited only

-   tierlist with password
    -   add a password dialog for protected tierlist #30
    -   add password field in save form dialog #30
-   for server personal tierlists
    -   split actions private/public and remove #28
    -   fix bad update after switch status private/public
-   update profile
    -   add OAuth2 in sign-up page
    -   add email in profile page
    -   add loader on login pages
-   add “sign up” in menu
-   fix hidden status on save form dialog
-   required: API `1.0.6`

## 1.4.1 (2022-11-06)

### Standalone web app

-   fix loading to optimize images #23
    -   fix test `url`
    -   add loading component
-   fix group tile coloration UX

### With API activited only

-   don't clone rankingID #22
-   add an option to not clone templateId #22
-   fix latest tierlists on homepage #24

## 1.4.0 (2022-11-06)

### Standalone web app

-   update font and add more icon in interface #18
    -   update classicon to `1.4`
-   show (i) only if annotation content
-   advanced options less visible

### With API activited only

-   redesign of the status change dialog for server tierlists #17
    -   add status
    -   add tooltips
    -   change of links to buttons
-   add last tierlists on home page #16
-   required: API `1.0.5`

## 1.3.1 (2022-10-31)

### Standalone web app

-   fix CSS mobile

## 1.3.0 (2022-10-31)

### Standalone web app

-   fix tooltip position on left
-   fix CSS mobile

### With API activited only

-   merge “**local list**” and “**profile**” into a “**personal list**” #14
-   add tierlist relationships between local and server #15
-   update category only if parent tierlist #12
    -   lock category if not parent tierlist
    -   update listlist children catagory when is parent template (server)
    -   required: API `1.0.4`
-   fix export image loading
-   fix routing (add `a:href` for a better tag structure )
    -   menu
    -   pagination
    -   navigation
    -   view

## 1.2.3 (2022-10-29)

### With API activited only

-   navigate:
    -   fix pagination when no criterion
    -   fix pagination display

## 1.2.2 (2022-10-29)

### With API activited only

-   navigate: add pagination
-   improve pagination component
-   improve pagination for search by criterion
-   required: API ``1.0.3

## 1.2.1 (2022-10-27)

### Standalone web app

-   add categories: food, brand and role-playing
-   fix minor bugs

### With API activited only

-   navigate:
    -   fix derivatives when empty search (but not null)
    -   remove invalide case in tierlist search

## 1.2.0 (2022-10-22)

### With API activited only

-   add change date #9
-   make a empty derivatives #10
-   add popup with all "my derivatives"
-   change URL of tierlist on save if id change
-   review all buttons on page view
-   required: API `1.0.2`

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
-   required: API `1.0.1`

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
-   required: API `1.0.0`

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
