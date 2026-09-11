# UI verification — browser required

Verify a UI bug in a real browser before claiming a fix, especially on mobile.

Ports, env vars, routes and the `/admin` warning live in `local-development.md` — start the servers
from there, then follow this procedure.

## Verification procedure

### 1. Confirm the build before reading the UI

A blank screen is more often a build error than a layout bug. Check `preview_logs` for the lines
that mean "ready":

- back: `Listening on port: 3334` (preceded by the sqlite `CREATE TABLE IF NOT EXISTS ...` lines)
- front: `➜ Local: http://localhost:3333/` then `Nuxt Nitro server built`

On a cold start the front takes ~20s to answer 200 (Vite pre-bundling `mapbox-gl`, `axios`) and
reloads once right after (`optimized dependencies changed. reloading`): wait for that reload before
judging what is rendered.

### 2. Match the viewport

`resize_window` with explicit `width`/`height` (e.g. 390×844 for a `< 400px` phone), not just a
theoretical `matchMedia`. Reload the page so load-time gates re-run, and confirm in the page:

```js
({ innerWidth, mm640: matchMedia('(max-width: 640px)').matches })
```

The project's main breakpoint is **640px** (`min-width: 640px` = desktop in most components).

### 3. Replay the exact scenario

Click the actual control with `computer` — a DOM snapshot without interaction proves nothing.
If the browser pane is hidden, `computer` fails with a timeout: either `tabs_select` to show it, or
drive the click through `javascript_tool`.

### 4. Count / measure what the user describes

Not "the panel exists" but "N elements visible **and** clickable", via `getBoundingClientRect` +
`elementFromPoint`:

```js
const clickable = [...document.querySelectorAll('button, a')].filter(b => {
  const r = b.getBoundingClientRect()
  if (!r.width || !r.height || r.top < 0 || r.bottom > innerHeight) return false
  return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('button, a') === b
})
clickable.length
```

### 5. If the user's screenshot still shows the bug

**Believe them** and back the fix out, rather than arguing "works on my machine" without even
matching their viewport.

### 6. Clean up

`resize_window` with `preset: "desktop"` to return the tab to its normal size, and `preview_stop` on
servers that are no longer needed.

## Console noise that is not your bug

Nuxt does SSR/SSG, so a server/client divergence shows up as a hydration mismatch — always read
`read_console_messages` before concluding. But some of it is pre-existing:

- `<DefaultLayout>` already mismatches on startup (`Hydration node mismatch` + `Hydration completed
  but contains mismatches`). Compare against a baseline before blaming a fix for it.
- `<Suspense> is an experimental feature` and the Nuxt DevTools banner are normal.

## Empty-looking UI that is not a CSS bug

- Article lists and the admin position are empty because the local database starts empty.
- A blank homepage map means `NUXT_PUBLIC_MAPBOX_TOKEN` was dropped from `front/.env.local`; the
  shipped default works.
