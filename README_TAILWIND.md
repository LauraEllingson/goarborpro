Tailwind setup (local)

What this adds:
- `package.json` scripts: `build:css` and `watch:css`.
- `tailwind.config.js` and `postcss.config.js`.
- `src/input.css` — Tailwind entry file.

Build commands

Install dependencies (will create node_modules):

```bash
cd /Users/laura/Desktop/goarborpro
npm install
```

Build a production CSS file (output `dist/tailwind.css`):

```bash
npm run build:css
```

Watch during development (rebuilds on change):

```bash
npm run watch:css
```

How to include in your pages

After building, include the generated CSS in your HTML (replace or load alongside your existing `styles.css`):

```html
<link rel="stylesheet" href="/dist/tailwind.css">
<!-- optional: keep your existing styles as a second stylesheet during migration -->
<link rel="stylesheet" href="/styles.css">
```

Prefixing & migration

If you want to avoid utility name collisions while migrating, add a `prefix: 'tw-'` option in `tailwind.config.js` and use `tw-` prefixed classes until you're ready to remove existing CSS.
