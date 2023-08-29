# App Layout

## Requirements

- App layout should be responsive
- Header should always stay fixed to the top of the browser window
- Footer should stay fixed to the bottom of the browser window on desktop
- Footer should scroll with the content on mobile
- The main course content should dictate scrolling for the app
- The sidebar should be fixed and scoll independently to the content
- The sidebar is hidden in mobile
- The sidebar content appears as a full screen menu on mobile, triggered by the hamburger button

## Layout design

- Layout component: main visible part of the application, coontains the header and footer, and displays its children in the body
- Body for the course player: Contains the sidebar and course content

```
Layout
 ____________________________
|            Header          |
|____________________________|
|                            |
|                            |
|            Body            |
|                            |
|                            |
|____________________________|
|           Footer           |
|____________________________|
               |
               V
Body
 ____________________________
| S |                        |
| i |                        |
| d |       Content          |
| e |                        |
|bar|                        |
|___|________________________|
```
