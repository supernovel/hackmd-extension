## hackmd-extension

My Posh Extension

## Build

-   `npm install`
-   build & pakaging `npm run build`
-   build `npm run build:dev`
-   watch `npm run watch:chrome`

## Watch Firefox

-   `npm run watch:firefox`
-   Open `about:debugging#addons`.
-   Load Temporary Add-on. (`package/*-firefox.xpi`)
-   Work.

## If watcher reload not work, try changing the port.
- [package.json => watchPort](./package.json)