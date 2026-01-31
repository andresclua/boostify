# Boostify JS

**Free & Open Source** - No license required.

Boostify is a lightweight JavaScript library that improves website performance by deferring third-party scripts and loading resources on demand.

## Why Boostify?

Third-party scripts (Google Analytics, Facebook Pixel, Hotjar, etc.) block your main thread and slow down your site. Boostify loads them in the background after your page is interactive.

## Installation

### npm

```bash
npm install boostify
```

```js
import Boostify from 'boostify';

const bstf = new Boostify({ debug: true });
```

### CDN

```html
<script src="https://unpkg.com/boostify@latest/dist/Boostify.umd.js"></script>
<script>
    const bstf = new Boostify({ debug: true });
</script>
```

## Quick Start: Load Analytics Without Blocking

### Step 1: Mark your scripts

Change `type="text/javascript"` to `type="text/boostify"`:

```html
<script type="text/boostify" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
<script type="text/boostify">
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);}
    window.gtag('js', new Date());
    window.gtag('config', 'G-XXXXX');
</script>
```

### Step 2: Initialize and load

```js
const bstf = new Boostify({ debug: true });

bstf.onload({
    worker: true,  // Load via proxy (recommended)
    callback: (result) => {
        console.log('Scripts loaded!', result);
    }
});
```

That's it. Your analytics load in the background without blocking your page.

## Debug Mode

When `debug: true`, you'll see colorful logs in your console with emojis:

| Event | Emoji | Color |
|-------|-------|-------|
| Boostify init | 🚀 | Purple gradient |
| OnLoad | ⚡ | Purple/violet |
| Click | 👆 | Pink/coral |
| Scroll | 📜 | Green/turquoise |
| Observer | 👁️ | Cyan/blue |
| Inactivity | 💤 | Pink/yellow |
| Script loaded | 📦 | Bright green |
| Style loaded | 🎨 | Pink |

## Recommendation: Use Google Tag Manager

Instead of multiple scripts, use GTM as a single container:

```html
<script type="text/boostify" src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXX"></script>
```

Then add all your tags (Facebook Pixel, Hotjar, HubSpot, etc.) inside GTM. One proxy request, everything works normally.

## Features

### Trigger Events

| Method | Description |
|--------|-------------|
| `bstf.onload()` | Defer third-party scripts until page is interactive |
| `bstf.scroll()` | Fire callback when user scrolls to a distance |
| `bstf.click()` | Fire callback on element click |
| `bstf.observer()` | Fire callback when element enters viewport |
| `bstf.inactivity()` | Fire callback when user is inactive |

### Content Injection

| Method | Description |
|--------|-------------|
| `bstf.loadScript()` | Dynamically inject JavaScript |
| `bstf.loadStyle()` | Dynamically inject CSS |
| `bstf.videoPlayer()` | Inject HTML5 video player |
| `bstf.videoEmbed()` | Inject YouTube/Vimeo embed |

## Examples

### Load scripts on scroll

```js
bstf.scroll({
    distance: 300,
    callback: async () => {
        await bstf.loadScript({
            url: 'https://example.com/library.js',
            appendTo: 'body'
        });
    }
});
```

### Load scripts on click

```js
bstf.click({
    element: document.getElementById('load-chat'),
    callback: async () => {
        await bstf.loadScript({
            url: 'https://example.com/chat-widget.js',
            appendTo: 'body'
        });
    }
});
```

### Load when element is visible

```js
bstf.observer({
    element: document.querySelector('.lazy-section'),
    callback: async () => {
        await bstf.loadStyle({
            url: 'https://example.com/section-styles.css',
            appendTo: 'head'
        });
    }
});
```

### Detect user inactivity

```js
bstf.inactivity({
    idleTime: 5000,
    name: 'my-inactivity',
    callback: () => {
        console.log('User has been inactive for 5 seconds');
    }
});
```

## Proxy: Supported Services

When using `worker: true`, these services load through Boostify's proxy:

- Google Tag Manager
- Google Analytics
- Facebook Pixel
- Microsoft Clarity
- Hotjar
- LinkedIn Insight
- TikTok Analytics
- HubSpot
- jsDelivr, unpkg, cdnjs

Services not listed? Use `worker: false` (still deferred, just not proxied) or [request the domain](https://github.com/andresclua/boostify/issues).

## Documentation

Full documentation at [boostifyjs.com](https://boostifyjs.com/)

- [On Load Events](https://boostifyjs.com/trigger-events/on-load/)
- [Scroll Events](https://boostifyjs.com/trigger-events/on-scroll/)
- [Click Events](https://boostifyjs.com/trigger-events/on-click/)
- [Observer Events](https://boostifyjs.com/trigger-events/observer/)
- [Inactivity Detection](https://boostifyjs.com/trigger-events/inactivity/)
- [Load Script](https://boostifyjs.com/content-injection/load-script/)
- [Load Style](https://boostifyjs.com/content-injection/load-style/)

## Support

- [GitHub Issues](https://github.com/andresclua/boostify/issues)
- [Discord](https://discord.gg/zHseJ3sw8J)
- [Sponsor](https://github.com/sponsors/andresclua)

---

## Changelog

### [0.0.18] - 2026-01-31
**Changed**
- Library is now free and open source (no license required)
- Added `worker` option to `onload()` for proxy-based loading
- Added Web Worker support for background script fetching
- Callback now receives detailed result object (loadTime, method, scripts, etc.)
- Renamed `destroyNoMatterWhat()` to `destroyAll()`

### [0.0.17] - 2025-08-15
**Changed**
- Library Validation

### [0.0.16] - 2025-08-15
**Changed**
- Enhanced inactivity detection with dual-mode support (user idle/native idle)
- Added `maxTime` parameter for better idle timeout control
- **Breaking**: `destroyinactivity()` now requires event name parameter

**Improved**
- Event listeners now use passive mode for better performance
- More robust timer cleanup with centralized management

### [0.0.15] - 2025-08-07
**Changed**
- Fix autoplay true/false in videoplayer

### [0.0.14] - 2025-06-18
**Changed**
- Refactored event handling
- Added user inactivity detection feature

### [0.0.13] - 2024-04-11
**Changed**
- [Issue #2](https://github.com/andresclua/boostify/issues/2) fixed

### [0.0.12] - 2024-04-04
**Changed**
- Updated `package.json` to resolve Netlify build issues

