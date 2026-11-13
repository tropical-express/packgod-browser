# 💀 Packgod Browser

**Packgod Browser 2.0** is a chaotic, dark-themed desktop browser built with Electron and Chromium.

> The 2.0 development branch is an active rebuild. Some planned features are not implemented yet.

## Current 2.0 foundation

- Electron 45.3.2
- Chromium-powered browsing through Electron's `WebContentsView`
- Multi-tab creation, activation, and closing
- Address bar with web search and URL normalization
- Back, forward, reload, and home controls
- Keyboard shortcuts: `Ctrl+L`, `Ctrl+T`, `Ctrl+W`, `Ctrl+R`, `Alt+←`, `Alt+→`
- Chaotic neon-green new-tab dashboard and optional calmer appearance
- Context isolation, sandboxed renderers, disabled Node integration, and a narrow preload API
- Persistent browser session partition

## Planned work

- Bookmarks and browsing history
- Download manager
- Settings and search-engine preferences
- Roast and sound-effect system, with user controls
- More customization and accessibility options
- Automated tests and release pipeline

## Development setup

Requirements:
- Node.js 22.12 or newer
- npm

```bash
git clone https://github.com/tropical-express/packgod-browser.git
cd packgod-browser
git switch v2-development
npm install
npm start
```

## Packaging

```bash
npm run pack
npm run dist
```

Build output is written to `dist/`. Windows NSIS and portable builds, plus Linux DEB and AppImage targets, are configured in `package.json`.

## Security notes

- Website content runs in separate `WebContentsView` instances, not in the privileged UI renderer.
- The UI renderer uses context isolation, sandboxing, and no Node integration.
- The preload exposes only the browser operations required by the UI.
- Site permission requests are denied by default in this initial foundation.
- Only HTTP and HTTPS navigation is accepted from the address bar.

This is an early development foundation, not yet a finished or security-audited browser. Do not use it as a replacement for a fully maintained mainstream browser for sensitive activity.

## License

Packgod Browser is distributed under the GNU General Public License v3.0. See [LICENSE](LICENSE).
