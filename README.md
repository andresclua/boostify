# Boostify JS

**Boostify** is a lightweight, high-performance JavaScript library built to enhance website loading and overall performance. It offers tools to manage events smartly, load resources efficiently, and improve user experience—without compromising speed.

## Features

- 🔥 **Smart Event Triggers**  
  Fire events only when needed to optimize performance and reduce overhead.

- ⚙️ **Helper Functions**  
  Easily inject JavaScript files, CSS, and HTML content on demand.

For more information, visit [boostifyjs.com](https://boostifyjs.com/)

---

## Changelog

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