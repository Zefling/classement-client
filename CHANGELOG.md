# Changelog - Standalone web app & API

### 4.3.13 (2025-12-24)

#### Standalone web app

- Improve alt text
- Fix background image selection

> - Update to **Angular** `21.0`
> - Update to **Magma** `1.1.1`
> - Update to **ECharts** `6.0.0`

### 4.3.12 (2025-11-08)

#### Standalone web app

- Fix title position
- Fix error messages
- Fix color button in standard mode

> Update to **Angular** `20.3`

#### With API activated only

- Add control option before save

### 4.3.11 (2025-10-02)

#### Standalone web app

- Add an option to randomize after emptying groups
- Add context menu on list
- Fix magma usage for textarea
- Fix background image list
- Fix stream mode for pin list
- Improve streamer mode for options

### 4.3.10 (2025-09-27)

#### Standalone web app

- Increase the size of the dialog box to generate text tiles to 2000 characters

### 4.3.9 (2025-09-06)

#### Standalone web app

- Add discord link

> Update to **Magma** `0.9.1`

#### With API activated only

> Required: API `2.0.5`

### 4.3.8 (2025-08-29)

#### Standalone web app

- Try to detect when the web app is updated
- Ability to pin the main list
- Fix preferences title dialog
- Fix alpha calculation with `Color.js`
- Fix width for edit-zone in mobile

### 4.3.7 (2025-08-26)

#### Standalone web app

- Fix infinite save when autoSave is selected
- Adjust background color when hovering over group

### 4.3.6 (2025-08-26)

#### Standalone web app

- Use `mg-message` for error blocks #124
- Remove unnecessary class icon
- Minor fixes

#### With API activated only

- Admin: fix CSS icon position #126

### 4.3.5 (2025-08-25)

#### Standalone web app

- Add 8 new categories

#### With API activated only

- Fix login, sign-up, password lost forms

> Required: API `2.0.4`

### 4.3.4 (2025-08-22)

#### With API activated only

- Fix typo in url #123

> Required: API `2.0.2`

### 4.3.3 (2025-08-21)

#### With API activated only

- Fix username encoding for profile page
- Fix url encoding

> Required: API `2.0.1`

### 4.3.2 (2025-08-20)

#### Standalone web app

- Fix titles
- Fix a forgotten test

> Update to **Angular** `20.2`, **Magma** `0.8.6`

#### With API activated only

- Fix error in API
- Fix admin error message

> ⚠️ Required: API `2.0.0` (see changelog)

### 4.3.1 (2025-08-11)

#### Standalone web app

- Add title in `alt` #120

#### With API activated only

- Admin
    - fix category edit
    - stats: fix 53rd week

### 4.3.0 (2025-08-10)

#### Standalone web app

- Improve tile selection on keyboard
- Add keyboard navigation:
    - Main list: #114
        - `ctrl` + `←` / `→` / `home` / `end`: to move in main line
        - `ctrl` + `↑` : move / copy in ranking
    - Tierlist / Teams / Bingo: #114
        - `ctrl` + `←` / `→` / `home` / `end`: to move in line
        - `ctrl` + `↑` / `↓`: change line
        - `ctrl` + `delete`: back to main list
    - Columns: #114
        - `ctrl` + `↑` / `↓` / `home` / `end`: to move in column
        - `ctrl` + `←` / `→`: change column
        - `ctrl` + `delete`: back to main list
    - Iceberg / Axis: #119
        - `ctrl` + `↑` / `↓` / `←` / `→`: move in zone (15px step)
        - `ctrl` + `⇧` + `↑` / `↓` / `←` / `→`: move in zone (1px step)
        - `ctrl` + `delete`: back to main list
    - Update **Help** panel (?) with new shortcuts
- Replace `ctrl` + `u` by `ctrl` + `⇧` + `Z`
- Add **Anilist** dialog to import anime or manga tiles #111
- Add `alt` text in image export dialog #117
- Add badges in **Home** page #113
- Add help (?) ni **Theme** dialog to create a new theme
- Add “community” category
- Iceberg / Axis:
    - Ability to edit section titles directly in the zone #118
    - Fix background on mouse over
    - Fix current theme

> Update to **Angular** `20.1`, **Magma** `0.8.5`

#### With API activated only

- Fix deletion of unwanted text #112
- Admin: fix stats #115

> Required: API `1.32.1`

---

### 4.2.0 (2025-06-29)

#### Standalone web app

- Better keyboard navigation in menu
- Add Framagit links
- Update to **Magma** `0.8.1`
    - Replace loading-cmp by mg-spinner
    - Replace loader-item by mg-loader-block
    - Replace loader-cmp by mg-loader
    - Improve save progress steps
- Add suffix for logger service
- Adjust category input size
- Fix `ctrl-Z`/`U` for teams (problem with id & type)
- Fix minimal width for tile list for edit ranking

#### With API activated only

- Fix mobile for banner in view #110
- Fix bad usage of menu tag (replace by nav tag)
- Fix image alignment in navigation tiles
- Fix translations
- Fix focus for navigation tiles

---

### 4.1.0 (2025-06-08)

#### Standalone web app

- Add tile selection on click for #108
    - tierlist
    - teams
    - columns
    - iceberg
    - axis
    - bingo
- Add cover: `contain` for image #109
- Update emoji list (`16.0`)
- Fix buttons in mobile mode (top of edit page) #106
- Fix tile size in mobile mode (edit list)
- Fix outline in menu

> Update to Angular `20.0`

#### With API activated only

- Add link on tag on preview page #107

> Required: API `1.32.0`

---

### 4.0.6 (2025-05-04)

#### Standalone web app

- Fix unnecessary opacity and backward compatibility values

#### With API activated only

- Admin: add user / ranking charts #104

> Required: API `1.31.0`

### 4.0.5 (2025-05-02)

#### Standalone web app

- Add info for resize preference
- Update packages (**Angular**, **Magma** and others)
- Use Magma `clickEnter` instead of click

> Update to magma `0.5.2`

#### With API activated only

- Bingo: add text to help users #102
- Admin: add all tiles and description in ranking view #103

### 4.0.4 (2025-04-27)

#### With API activated only

- Username or email on login #101
- Admin: show previous information for user

> Required: API `1.30.1` for test

### 4.0.3 (2025-04-04)

#### Standalone web app

- Add auto-resize preference #99
- Add debounce when adding to undo list #100
- Advanced options: native keyboard for select

### 4.0.2 (2025-03-30)

#### Standalone web app

- Fix alternative url id (linkId)

### 4.0.1 (2025-03-23)

#### Standalone web app

- Fix context menu in editor
- Fix advanced options that remove tiles

> Update to **Magma** `0.4.1`

### 4.0.0 (2025-03-22)

> Migration to the **Magma** framework `0.4.0` ([magma.ikilote.net](https://magma.ikilote.net))<br>
> A framework started with the components of this project

#### Standalone web app

- **Magma**
    - Use new inputs for all forms
    - Add a color picker with alpha support
    - Rewrite a part of advanced options panel
- Remove `coloration-lib` and use `colorjs.io`
- Add options for the fork #90
- In preferences, add options:
    - advanced options (now, hide by default)
    - fork ranking (no active by default)
- Fix missing edit button for personal ranking
- Fix color select for background name group

> Update to Angular `19.2.3`

#### With API activated only

- Allow indicating that the content is 18+ #94
- Add a list of tiles below when no tiles are present in the view #98
- Fix theme server search
- Fix Bingo help persisting

> Required: API `1.30.0` for test

---

### 3.1.8 (2025-01-01)

#### Standalone web app

- Fix drag'n drop in zone mode (axis/iceberg) with old `drag.ts` (Angular `18.2.14`) (Break since Angular `19`)
- Fix changelog page

### 3.1.7 (2024-12-30)

#### Standalone web app

- Test if server is OK
    - ModeAPI in computed() mode
- Switch to stand-alone mode if no server found
- Group information pages
    - Add changelog page

#### With API activated only

> Required: API `1.21.1` for test

### 3.1.6 (2024-12-24)

#### Standalone web app

- Fix image loading between new tiles and custom background #93
- Fix CSS build
- Add VTuber category

### 3.1.5 (2024-11-29)

#### Standalone web app

> Update to Angular `19.0`

### 3.1.4 (2024-11-24)

#### Standalone web app

- Add animation to navigation tiles
- Fix title width in tile (1px round ?)
- Adjust header in edit page
- Adjust grid of edit page

### 3.1.3 (2024-11-23)

#### Standalone web app

- Home: `target="_blank"` for external links
- Reduce init options height
- Fix title width in tile

### 3.1.2 (2024-11-10)

#### Standalone web app

- Fix annoying flashing in mode selection dialog
- Animation: `starting-style` on dialog
- Fix mode list on Chrome

### 3.1.1 (2024-11-09)

#### Standalone web app

- Columns:
    - add help
    - fix link in image render
- Add bingo and columns to default preferences

### 3.1.0 (2024-11-08)

#### Standalone web app

- Add mode: Columns #88
    - Allow ranking in column
    - Specific tile behavior for columns
    - Added specific options for columns

#### With API activated only

> Required: API `1.21` for columns

---

### 3.0.4 (2024-10-31)

#### With API activated only

- Memory: fix undo/redo on server load
- Fix groups avec server save
- Update packages : Angular, Transloco, Select2, Cropper, Markdown

### 3.0.3 (2024-10-27)

#### Standalone web app

- Perf: simplification of Angular modules
- Bingo: don't reset transformation when changing emoji

### 3.0.2 (2024-10-25)

#### Standalone web app

- Fix the background of the tiles of the themes
- Fix tile alignment & margin in navigation
- Fix tile names and group titles in preview

### 3.0.1 (2024-10-24)

#### Standalone web app

- Fix fonts with markdown
- Improve emoji list
- Improve advanced options on mobile
- Fix blocks in 3rd party licenses view

### 3.0.0 (2024-10-23)

#### Standalone web app

- Options & themes
    - Move advanced options without a dialog #83
        - Add preview with advanced options #86
    - Add JSON import/export of options (theme) #84
    - Add browser backup with theme manager #85
        - Add
        - Delete
        - Replace
    - Add font selection #81
- Add tabs in the themes dialog #85
    - generic themes
    - browser themes
    - search for themes
- Preferences
    - group emoji by ton, hear, etc. #80
- Improve dialog #82
- Fix bugs
    - Fix and improve undo-redo with groups and themes #87
    - Fix markdown with strong
    - Fix markdown render
    - Fix tile text color in some cases
    - Fix background in iceberg mode
    - Fix font & text in tiles
    - Bingo: fix text-only tile
    - Fix tile calculation for iceberg & axis
    - Fix background image initialization

#### With API activated only

- Options & themes
    - Add account backup with theme manager #85
        - Add: private or public themes
        - Delete
        - Replace
- Add tabs in the themes dialog #85
    - your account themes
    - other users' public themes
    - search for themes
- Required: API `1.20.1` with schema validation

---

### 2.5.2 (2024-09-07)

#### Standalone web app

- Collapse buttons when tile height < 100px
- Add theme classic (with palette)
- Fix padding of add tiles

### 2.5.1 (2024-09-04)

#### Standalone web app

- Improve zoom option
- Fix help button size
- Fix remove zoom when exit the classement view
- Change scrollbar for webkit & blink browsers

#### With API activated only

- Fix emoji transform persistance
- Fix context-menu: only for emoji
- Emoji only for API

### 2.5.0 (2024-09-04)

#### Standalone web app

- Add zoom option for mobile #79
- Fix bug when there are no preferences
- Fix `cdk-global-scrollblock` with context-menu

#### With API activated only

- Add emoji for Bingo view #75
    - Add tab “Emoji” in preferences dialog
    - Use _Unicode_ emoji list
    - Add bubble style context-menu
    - Add emoji transformation mode with **Moveable**
    - Add help panel for emoji
- Add animation on bubble context-menu #77
- Fix mobile edit mode for **Bingo** #78

---

### 2.4.4 (2024-08-24)

#### Standalone web app

- Add context menu to tiles #74
- Fix bingo fork
- Minor fixes

### 2.4.3 (2024-08-22)

#### Standalone web app

- Rewrite IMDB access #73
- Little change for subscription helper #72
- Minor fixes

#### With API activated only

- Fix history list
- Required: API `1.15`

### 2.4.2 (2024-08-17)

#### Standalone web app

- Add line fusion
- Bingo: add grid theme
- Fix grid spacing
- Fix theme change crash

### 2.4.1 (2024-08-16)

#### Standalone web app

- Add border radius/spacing/size options
- Fix help content

### 2.4.0 (2024-08-16)

#### Standalone web app

- Add help panel #11
- Add export shortcut (`ctrl` + `e`)
- Add undo (`ctrl` + `z`) & redo (`ctrl` + `u`) #70
- Add option to add link to image #69
- Fix reduce menu in mobile that should not be present
- Fix burger menu icon position
- Fix data zeroing on data change (broken)
- Fix detect changes
- Fix missing tile ids
- Update to Angular `18.2`

---

### 2.3.9 (2024-08-12)

#### Standalone web app

- Edit group name height: fix for Chromium
- Webp is not supported on Safari (Webkit)

### 2.3.8 (2024-08-04)

#### Standalone web app

- Options: alignment of input numbers, add units
- Don't display the fullscreen button on mobile (already "fullscreen")
- Fix view mobile for Bingo
- Fix select2 animation bug

### 2.3.7 (2024-08-04)

#### Standalone web app

- Bingo: Persist symbol
- Bingo: fix image rendering when changing symbol

### 2.3.6 (2024-08-04)

#### Standalone web app

- Don't show group counts for iceberg, axis & bingo
- Fix bingo selection (for the first bingo)

### 2.3.5 (2024-08-03)

#### Standalone web app

- Use Select2 in grid mode for validated & mode
- Fix navigate link in menu

### 2.3.4 (2024-07-28)

#### Standalone web app

- In line edit mode in a dialog, move the current line without closing the dialog
- Fix line colors options in dialog

### 2.3.3 (2024-07-27)

#### Standalone web app

- Fix option alignment
- Fix drop files

### 2.3.2 (2024-07-23)

#### Standalone web app

- Allow a min & max number of lines for the title #68
- Fix text options
    - Keyboard navigation
    - Background color for bubble
    - More understandable text position

### 2.3.1 (2024-07-21)

#### Standalone web app

- Add an option to have a different text size for tiles without image #67
- Fix image render with local data

### 2.3.0 (2024-07-21)

#### Standalone web app

- Add mode: Bingo #48
    - Drag'n drop into grid
    - Specific options
        - Grid size
        - Themes
    - New dedicated features in view mode
        - Allow selecting tiles: #65
            - Check circled
            - Check
            - Circle
            - Hanamaru
            - Heart
        - Bingo persistence in the browser #66
- Add bubble title #64
- Fix language change for title
- Fix title in edit page
- Fix if title without image, ignores display options

#### With API activated only

- Required: API `1.14.1` for Bingo

---

### 2.2.2 (2024-07-18)

#### Standalone web app

- HTML templates refactoring
- Change `ngx-translate` to `transloco` for internationalization
- Update packages

### 2.2.1 (2024-07-17)

#### Standalone web app

- Fixed a login regression with OAuth
- Update Angular CDK

### 2.2.0 (2024-07-16)

#### Standalone web app

- Fix weird animation issue in icebergs and axes
- Add `robots.txt` & `favicon.ico`
- Update to Angular `18.1`
    - Use `cdkDropListOrientation="mixed"` for better drag'n drop in lists (remove hack) #60
    - Signal: change for `input`/`output`/`viewChild`/`contentChildren` #61

#### With API activated only

- Required: API `1.14`
    - Fix read classement not hidden with password (ignore this)
    - Support multi-domain (for domain change)
    - Fix classement without images

---

### 2.1.12 (2024-07-07)

#### Standalone web app

- Fix history length #59
- Fix title height with title for all options
- Update html2canvas
- Add Github links

### 2.1.11 (2024-06-04)

#### Standalone web app

- Fix tile size in list and drag-preview
- Fix image render for Firefox

### 2.1.10 (2024-06-02)

#### Standalone web app

- Add size text in tile #58
- Update to Angular `18`

### 2.1.9 (2024-05-09)

#### Standalone web app

- Fix textarea in add text dialog
- Fix a problem on a tile when adding an image if there is none or it has been deleted
- Fix dialog of avatar
- Minor fixes

### 2.1.8 (2024-05-08)

#### Standalone web app

- Fix cartouche on home page for mobile
- Fix naming for version of ranking
- Better default size image for the Square theme
- Fix the height of large image preview
- Update `@wtto00/html2canvas` to `@html2canvas/html2canvas`

### 2.1.7 (2024-05-08)

#### Standalone web app

- Add an option for cover the entire tile
- Add a square theme
- Fix theme list
- Update `html2canvas` to `@wtto00/html2canvas` (for `object-fit`)
- Minor fixes

### 2.1.6 (2024-04-20)

#### Standalone web app

- Upgrade to new Angular templates
- Fix title color in light mode (over)
- Fix calculation error between base64 and server images in tiles
- Minor fixes

#### With API activated only

- Admin: Fix classement render

### 2.1.5 (2024-04-01)

#### Standalone web app

- View: add enlarge & fullscreen modes #56
- Fix title color in light mode

### 2.1.4 (2024-03-26)

#### Standalone web app

- Fix `toggle-switch` render
- “ranking versions” naming
- Fix calculation of (vertical) tiles with title
- Fix crash with `color-mix()` for `html2canvas`
- Fix rendering ⓘ

### 2.1.3 (2024-03-24)

#### Standalone web app

- Better display when no results in search (remove error)
- Interface improvement
    - Wrap mode choice (for mobile)
    - Fix naming
    - Simplify the ranking fork
    - Improved rendering of the ranking choice
    - Interface adjustment
    - User: server ranking first
- Palette update for light theme
- Minor fixes

### 2.1.2 (2024-03-16)

#### Standalone web app

- Fix calculation of tiles with title
- Rewrite colors to use a dynamic light/dark palette
- Update to Angular `17.3`

### 2.1.1 (2024-03-05)

#### Standalone web app

- Fix image size in edit dialog
- Improve action buttons in edit mode
- Update to Angular `17.2` and packages

### 2.1.0 (2024-01-25)

#### Standalone web app

- Improvement of texts #50
- Add search mode in navigation #52
- Add delete button in tile edit dialog #54
- Middle click to remove tile from group #55
- Add font Roboto
- Update to Angular `17.1`

#### With API activated only

- Add sitemap
- Required: API `1.13`

---

### 2.0.4 (2023-11-15)

#### Standalone web app

- Remove font Tahoma
- Fix 404 error

#### With API activated only

- `https://example/~id` → template
- `https://example/@user` → user

### 2.0.3 (2023-11-04)

#### Standalone web app

- Add `mode` column to lists and admin
- Fix drag scroll (Firefox)
- Fix mobile for zones
- Fix mode render on tiles

#### With API activated only

- Add loader on user profile

### 2.0.2 (2023-10-30)

#### Standalone web app

- Fix a display regression

#### With API activated only

- Add mode on tiles

### 2.0.1 (2023-10-29)

#### Standalone web app

- Fix iceberg advanced option names
- Minor fixes

### 2.0.0 (2023-10-22)

#### Standalone web app

- Add new modes: Iceberg & Axis #48
    - Drag'n drop into position without sorting
        - Drop tile into selection box
        - Drop tile to position
        - Save tile location
    - Specific options (iceberg & axis)
        - Adding groups/sections
        - Display groups
        - Color management
    - Theme management by mode
    - New dedicated features
        - Tiles organization (change z-index)
        - Double click to create an empty tile at the desired location
        - Text color
        - Transparent background
        - max-width / max-height
    - Add a dialog for text tiles
- Menu improvement #49
    - Add icons
    - Add reduced mode
- Improuve choice #51
    - Preference : add mode choice
    - Add dialog mode
    - Add icons
- Keyboard shortcut
    - `Ctrl` + `s` => Browser save
- Minor fixes

#### With API activated only

- Fix email & password change [critical]
- Required: API `1.12.3`

---

### 1.12.6 (2023-09-15)

#### Standalone web app

- Add markdown option in group name
- Fix display mode change

#### External service

- Fix IMDB image size

#### With API activated only

- Fix hidden status after login
- Fix reset cache after save
- Required: API `1.12.2`

### 1.12.5 (2023-09-12)

#### With API activated only

- Add server tile in profile
- Add link for lists

### 1.12.4 (2023-09-11)

#### Standalone web app

- Use Markdown on description
- Fix double loading of language files when it is not English
- Add description size and fix style
- Language: fix french
- Mirror fixes

### 1.12.3 (2023-09-03)

#### External service

- Add IMDB API for search movies #44
- Use Crowdin for translation

### 1.12.2 (2023-08-31)

#### Standalone web app

- Fix total size after save
- Improve styles: tags, buttons
- Improve CSS animations

#### With API activated only

- Recommended: API `1.12.1`

### 1.12.1 (2023-08-30)

#### Standalone web app

- Fix select2 render
- Fix keyboard navigation on table
- Add Switch theme color transition

### 1.12.0 (2023-08-27)

#### Standalone web app

- Add tile title on hover #43

#### With API activated only

- Add dialog to change username #26
- Add option to save locally (breaking change)
- No search tag when empty
- Required: API `1.12.0`

---

### 1.11.13 (2023-08-27)

#### Standalone web app

- Fix detect change values and ignore autoSave & showAdvancedOptions

#### With API activated only

- Add log in dialog in editor #42

### 1.11.12 (2023-08-23)

#### Standalone web app

- Change `select` to `select2` for background selection

### 1.11.11 (2023-08-22)

#### Standalone web app

- Change `select` to `select2` for categories
- Improve categories
- Fix history when linkId is used

### 1.11.10 (2023-08-12)

#### Standalone web app

- Update font for fix Windows 10 #45

#### With API activated only

- Don't call history if there is none and show number
- Required: API `1.11.1`

### 1.11.9 (2023-08-10)

#### Standalone web app

- Force resizing on cropper sizing error
- Update to Angular `16.2`
- Update to `ngx-image-cropper` `7.0`

### 1.11.8 (2023-07-30)

#### Standalone web app

- Add an option for change direction
- Fix tab order in options

### 1.11.7 (2023-07-30)

#### Standalone web app

- Improve calculation of width tiles on load and title change

### 1.11.6 (2023-07-11)

#### Standalone web app

- Add stream mode
- Fix home page

### 1.11.5 (2023-07-07)

#### Standalone web app

- Improve preferences dialog
- Close preference on backdrop
- Improve drag'n drop in mobile
- Update titles and add metadata

#### With API activated only

- Fix logout on lists page

### 1.11.4 (2023-07-06)

#### Standalone web app

- Fix homepage with large resolutions
- Improve mobile interface
    - Add scroll-snap in homepage for touch device
    - Fix date render in mobile
- Change of preferences
    - moved language and theme in the dialog
    - Added hidden mode for group options
    - Option formatting
- Minor fixes

### 1.11.3 (2023-06-27)

#### Standalone web app

- Improve search input
- Fix arrow for old system

### 1.11.2 (2023-06-23)

#### Standalone web app

- Add an option to hide the tile title

### 1.11.1 (2023-06-22)

#### Standalone web app

- Fix remove tiles in Teams mode

#### With API activated only

- Fix linkId on fork

### 1.11.0 (2023-06-22)

#### Standalone web app

- Add Teams mode #41
- Fix preferences

#### With API activated only

- Add page size preference #39
- Id renaming #13
- Required: API `1.11.0`

---

### 1.10.8 (2023-06-18)

#### Standalone web app

- Update to Angular `16.1`
- Add tile background color #40

### 1.10.7 (2023-06-11)

#### With API activated only

- Search forms are now real html forms

### 1.10.6 (2023-06-11)

#### Standalone web app

- Fix category sorting

#### With API activated only

- Fix date style in navigate

### 1.10.5 (2023-06-04)

#### Standalone web app

- Fix date (multi value) sort for Local list
- Remove eval (for better security)

### 1.10.4 (2023-06-04)

#### Standalone web app

- Add clear button `×` for search for Firefox (only)
- Add space use with IndexedDB in Local list
- Add button “Save and validate” when you quit editing without saving
- Fix recursive error with debounce
- Fix date sort for Local list

### 1.10.3 (2023-05-30)

#### Standalone web app

- rewrite tile size calculation

#### With API activated only

- admin: fix sort with paginate

### 1.10.2 (2023-05-28)

#### Standalone web app

- fix mobile

#### With API activated only

- admin: fix no result

### 1.10.1 (2023-05-28)

#### Standalone web app

- fix preference for new line
    - fix color
    - fix new line position

### 1.10.0 (2023-05-28)

#### Standalone web app

- add line option preference
- fix text font with font icon
- fix autosize in edit tierlist
- autosize refactoring

#### With API activated only

- admin update
    - add sort by column #38
    - add filters #38
    - add loading
    - edit category for a tierlist
- fix username with avatar
- fix cursor on user page
- required: API `1.0.10`

---

### 1.9.7 (2023-05-18)

#### With API activated only

- add page for user (@username)

### 1.9.6 (2023-05-17)

#### Standalone web app

- fix icons for Android

#### With API activated only

- fix color in admin

### 1.9.5 (2023-05-17)

#### Standalone web app

- improve mobile #35
- fix group options dialog for mobile

### 1.9.4 (2023-05-17)

#### Standalone web app

- improve mobile #35
- fix image download

### 1.9.3 (2023-05-15)

#### Standalone web app

- improve change detection
- tags are incorrectly persisted

### 1.9.2 (2023-05-14)

#### Standalone web app

- add dates in exported data
- fix access to indexedDB

### 1.9.1 (2023-05-14)

#### Standalone web app

- fix typo
- fix color un light mode

### 1.9.0 (2023-05-14)

#### Standalone web app

- update to Angular `16.0`
- add preferences dialog #34
- add tags for tierlist #31

#### With API activated only

- add avatar for user profile #19
- required: API `1.0.9`

---

### 1.8.3 (2023-04-28)

#### Standalone web app

- fix banner with local save

#### With API activated only

- fix links for history lierlist

### 1.8.2 (2023-04-23)

#### With API activated only

- fix history

### 1.8.1 (2023-03-28)

#### Standalone web app

- fix font size for group title

#### With API activated only

- fix sharing in editing

### 1.8.0 (2023-03-26)

#### With API activated only

- add history feature #33
- required: API `1.0.8`

---

### 1.7.3 (2023-03-11)

#### Standalone web app

- update to Angular `15.2`
- add total size in edit page
- fix big images in edit tile dialog
- fix error in console

### 1.7.2 (2023-02-08)

#### Standalone web app

- fix ratio calculate in image edit

### 1.7.1 (2023-02-08)

#### Standalone web app

- fix ratio field in image edit

### 1.7.0 (2023-02-05)

#### Standalone web app

- fix memory overflow crash with json too heavy
- add modify, replace and delete images for tiles

---

### 1.6.1 (2022-12-28)

#### Standalone web app

- fix background selection

#### With API activated only

- fix custom background on render

### 1.6.0 (2022-12-28)

#### Standalone web app

- image drop/copy in save dialog #32
- add custom background image #5
- change advanced options interface
- change URLs without reload the current tierlist

#### With API activated only

- fix propagation of ids between client and server
- required: API `1.0.7`

---

### 1.5.4 (2022-12-04)

#### Standalone web app

- `itemWidthAuto:true` by default

#### With API activated only

- fix export image when not logged.

### 1.5.3 (2022-11-22)

#### Standalone web app

- add backdrop filter

#### With API activated only

- fix loading tiles on homepage
- don't load unnecessary images

### 1.5.2 (2022-11-21)

#### Standalone web app

- update to Angular `15.0`

### 1.5.1 (2022-11-16)

#### Standalone web app

- fix id when fork
- add a dialog to prevent errors when clicking on Clear Groups

### 1.5.0 (2022-11-11)

#### Standalone web app

- tierlist edit
    - fix line title height
    - add description field #25
- homepage
    - remove an unnecessary title
    - add link to icon font source
- personal lists:
    - add a new directive to sort tables #21
    - add filter on personal lists #21
    - fix responsive for actions
- change menu order
- set language on HTML tag
- fix dialog input position

#### With API activated only

- tierlist with password
    - add a password dialog for protected tierlist #30
    - add password field in save form dialog #30
- for server personal tierlists
    - split actions private/public and remove #28
    - fix bad update after switch status private/public
- update profile
    - add OAuth2 in sign-up page
    - add email in profile page
    - add loader on login pages
- add “sign up” in menu
- fix hidden status on save form dialog
- required: API `1.0.6`

---

### 1.4.1 (2022-11-06)

#### Standalone web app

- fix loading to optimize images #23
    - fix test `url`
    - add loading component
- fix group tile coloration UX

#### With API activated only

- don't clone rankingID #22
- add an option to not clone templateId #22
- fix latest tierlists on homepage #24

### 1.4.0 (2022-11-06)

#### Standalone web app

- update font and add more icon in interface #18
    - update classicon to `1.4`
- show (i) only if annotation content
- advanced options less visible

#### With API activated only

- redesign of the status change dialog for server tierlists #17
    - add status
    - add tooltips
    - change of links to buttons
- add last tierlists on home page #16
- required: API `1.0.5`

---

### 1.3.1 (2022-10-31)

#### Standalone web app

- fix CSS mobile

### 1.3.0 (2022-10-31)

#### Standalone web app

- fix tooltip position on left
- fix CSS mobile

#### With API activated only

- merge “**local list**” and “**profile**” into a “**personal list**” #14
- add tierlist relationships between local and server #15
- update category only if parent tierlist #12
    - lock category if not parent tierlist
    - update listlist children category when is parent template (server)
    - required: API `1.0.4`
- fix export image loading
- fix routing (add `a:href` for a better tag structure )
    - menu
    - pagination
    - navigation
    - view

---

### 1.2.3 (2022-10-29)

#### With API activated only

- navigate:
    - fix pagination when no criterion
    - fix pagination display

### 1.2.2 (2022-10-29)

#### With API activated only

- navigate: add pagination
- improve pagination component
- improve pagination for search by criterion
- required: API ``1.0.3

### 1.2.1 (2022-10-27)

#### Standalone web app

- add categories: food, brand and role-playing
- fix minor bugs

#### With API activated only

- navigate:
    - fix derivatives when empty search (but not null)
    - remove invalide case in tierlist search

### 1.2.0 (2022-10-22)

#### With API activated only

- add change date #9
- make a empty derivatives #10
- add popup with all "my derivatives"
- change URL of tierlist on save if id change
- review all buttons on page view
- required: API `1.0.2`

---

### 1.1.3 (2022-10-22)

#### Standalone web app

- fix tile title color with annotation
- fix tile title position without image
- fix background preview

#### With API activated only

- remove url for tile with no image

### 1.1.2 (2022-10-18)

#### Standalone web app

- fix title width in tile when “automatic tile width” is activated
- improve langage FR & EN (Thanks Ambroise Croizat)

#### With API activated only

- fix crash when canceling Oauth authentication
- fix on save tierlist

### 1.1.1 (2022-10-16)

#### With API activated only

- fix image render

### 1.1.0 (2022-10-16)

#### Standalone web app

- add import / export all #8
- add annotation #7
- add maxlength for textarea
- improve dark mode

#### With API activated only

- rewrite navigation
- add page preview #3
- better visibility for personal derivatives
- required: API `1.0.1`

---

### 1.0.1 (2022-10-11)

#### Standalone web app

- fix group naming

#### With API activated only

- fix email validation

### 1.0.0 (2022-10-09)

#### Standalone web app

- improve group naming
    - added support for line breaks
    - autosize instead of scrollbar

#### With API activated only

- add an expiration days for cookies
- do not show advanced options on open
- improve textarea with autosize (contact page)
- fix loading issues in navigate
- fix auto login
- show hidden tierlist for current user
- required: API `1.0.0`

---

### 0.9.22 beta (2022-09-25)

#### Standalone web app

- do not show advanced options on open

#### With API activated only

- do not load personal derivative when not connected

### 0.9.21 beta (2022-09-24)

#### With API activated only

- improve navigation cards
- add icons
- fix when text is pasted in textarea

### 0.9.20 beta (2022-09-23)

#### With API activated only

- improve create account form
- improve password lost form
- fix a possible password leak with Chrome and Edge
- update texts

### 0.9.19 beta (2022-09-20)

#### Standalone web app

- fix image render

### 0.9.18 beta (2022-09-18)

#### With API activated only

- add the different tiles of derivative
- improve list “my derivative” on edit page
- add search by template and userId

### 0.9.17 beta (2022-09-17)

#### Standalone web app

- fix scrolling top when changing page

#### With API activated only

- add list “my derivative” on edit page
- fix css
- improve texts

### 0.9.16 beta (2022-09-17)

#### With API activated only

- fix update profile on save
- fix update rankings list on change
- fix navigation design
- fix derivative button on save

### 0.9.15 beta (2022-09-13)

#### Standalone web app

- add link to template in ranking edit

#### With API activated only

- fix options interface
- fix css

### 0.9.14 beta (2022-09-11)

#### With API activated only

- add counters in navigation results
- fix navigation result order
- fix first save ranking

### 0.9.13 beta (2022-09-09)

#### Standalone web app

- add more categories
- improve responsive display

### 0.9.12 beta (2022-09-09)

#### Standalone web app

- fix double optimization error
- fix CSS

#### With API activated only

- add share button
- add icons
- improve upload rendering

### 0.9.11 beta (2022-09-08)

#### Standalone web app

- refacto CSS

#### With API activated only

- add progressbar for tierlist save
- fix bad initialization for image cropper

### 0.9.10 beta (2022-09-07)

#### Standalone web app

- add global loader
- add loading in edit page

#### With API activated only

- improve loading in admin pages
- fix CORS for Chromium
- Google OAuth2 connection temporarily hidden

### 0.9.9 beta (2022-09-06)

#### Standalone web app

- improve responsive display

#### With API activated only

- add loader on navigate page

### 0.9.8 beta (2022-09-05)

#### With API activated only

- fix image render with https images (fix the type mine)

### 0.9.7 beta (2022-09-04)

#### Standalone web app

- add enlarge et fullscreen modes
- add a link to the changelog
- implement a log service
- fixed theme change (do not overwrite: title, category, autoSave, itemWidthAuto)

#### With API activated only

- fix image render with https images

### 0.9.6 beta (2022-09-04)

#### Standalone web app

- fix saving if an edit and replace with "new"

#### With API activated only

- fix connection if never connected

### 0.9.5 beta (2022-09-03)

#### Standalone web app

- add navigation in home page

### 0.9.4 beta (2022-09-03)

#### Standalone web app

- add `titleTextColor` option
- option opacity change to input range
- reduce default padding for tiles
- show “Automatic tile width” all the time
- improve rendre for input toggle
- fix minor bugs

### 0.9.3 beta (2022-09-02)

#### With API activated only

- improve the rendering of roles and statuses in the admin

### 0.9.2 beta (2022-09-01)

#### Standalone web app

- fix minor bugs

### 0.9.1 beta (2022-08-31)

#### Standalone web app

- block save when empty
- fix import json
- fix light-dark mode

#### With API activated only

- add loading on save

### 0.9.0 beta (2022-08-30)

#### Standalone web app

- update to Angular `14.2`
- add auto save
- add an API switch in the environment configuration

#### With API activated only

- sign up / login / oauth
    - Discord
    - Facebook
    - Google
- profil management
- save tierlists with account
- search/browse tierslists on server
- admin pages management: users / tierlists
- contact

# Changelog - Standalone web app

### 0.5.5 (2022-06-09)

- drop content in all the page

### 0.5.4 (2022-06-03)

- update to Angular `14.0`
- fix minor css bugs

### 0.5.3 (2022-05-15)

- add import in list page
- block page reload in edit mode
- fix minor bugs

### 0.5.2 (2022-04-16)

- fix import (decode UTF-8)

### 0.5.1 (2022-04-16)

- fix import

### 0.5.0 (2022-04-15)

- add auto tile width
- add text position in tiles
- add options for tile text
- change the interface of advanced options
- fix minor bugs

### 0.4.3 (2022-04-11)

- change demo path: https://classement.ikilote.net/
- add Japanese
- fix minor bugs

### 0.4.2 (2022-04-08)

- add the sky theme

### 0.4.1 (2022-04-06)

- add page for third-Party licenses
- fix copy/paste in input
- change favicon

### 0.4.0 (2022-04-06)

- add text below the image or just text
- Add text for the drop (one tile per line)
- copy/paste images or text (one tile per line)

### 0.3.0 (2022-04-03)

- add image optimization dialog (with pica)
- update Angular to version `~13.3.0`

### 0.2.1 (2022-03-29)

- add the “night” theme
- add group name background opacity
- fix rendering with Chromium browsers
- fix minor bugs

### 0.2.0 (2022-03-28)

- add theme selection
- add SVG background images
- fix minor bugs and code refactoring

### 0.1.4 (2022-03-25)

- add clear bouton
- add message for infos, successes or errors

### 0.1.3 (2022-03-22)

- add options for group name sizes
- fix minor bugs

### 0.1.2 (2022-03-21)

- add options for final image background color and size
- change options UI
- fix minor bugs

### 0.1.1 (2022-03-18)

- add json import and export (import and replace / import and new)
- predefine files for input:file
- fix minor bugs

### 0.1.0 (2022-03-16)

- add tiles for add images
- tablet and mobile interface (for testing)
- remove `/classement` in routes
- fix minor bugs

### 0.0.7 (2022-03-13)

- add option to clone classifications
- fix dark/light via cookie
- fix minor bugs

### 0.0.6 (2022-03-12)

- buttons to save the generated image: PNG, Jpeg or WebP
- warning popup on change
- fix minor bugs

### 0.0.5 (2022-03-11)

- better options render
- fix light theme
- fix id for new classification
- fix opacity
- fix wording

### 0.0.4 (2022-03-10)

- add advanced options: more sizes and colors
- change dark/light button.
- fix wording

### 0.0.3 (2022-03-06)

- add dark mode.
- change color selector buttons.
- more categories.

### 0.0.2 (2022-03-06)

- fix drag'n drop size and alignment.
- added warning on deletion.
- button design.

### 0.0.1 (2022-02-27)

- initial version.
