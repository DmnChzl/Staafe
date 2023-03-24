# Staafe - Stay Safe

## TODO:

> Manifest V3

```json
{
  "name": "Staafe - Stay Safe",
  "short_name": "Staafe",
  "version": "0.1.0",
  "manifest_version": 3,
  "description": "Search the web but stay safe",
  "icons": {
    "16": "icon16.png",
    "32": "icon32.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "permissions": ["storage"],
  "host_permissions": ["https://safe.duckduckgo.com/*"],
  "action": {
    "default_icon": {
      "16": "icon16.png",
      "32": "icon32.png",
      "48": "icon48.png",
      "128": "icon128.png"
    },
    "default_title": "Staafe",
    "default_popup": "index.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "dmnchzl@staafe"
    }
  },
  "web_accessible_resources": [
    {
      "resources": ["fonts/*.ttf", "icons/*.png"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

## Miscellaneous

If you want more,

You can clone the project:

```
git clone https://github.com/dmnchzl/staafe.git
```

Install dependencies:

```
yarn install
```

Develop locally:

```
yarn dev
```

If you want, format the code:

```
yarn format
```

Compile the project:

```
yarn build
```

Compile the project (as an extension):

```
yarn build:ext --overwrite-dest
```

Enjoy 👍

## License

```
"THE BEER-WARE LICENSE" (Revision 42):
<phk@FreeBSD.ORG> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return. Damien Chazoule
```
