# UI verification — browser required

Verify a UI bug in a real browser before claiming a fix, especially on mobile.

## Verification procedure

### 0. Prerequisites

Both servers are needed: the front (3333) calls the API at `NUXT_ENV_API_URL`
(`http://localhost:3334` by default). The configs are already in `.claude/launch.json` (they load
Node 22.22.0 through nvm):

- `preview_start` with `name: "recontact-back"` → API on 3334
- `preview_start` with `name: "recontact-front"` → Nuxt dev server on 3333

Check the build with `preview_logs` before concluding anything about the UI: a blank screen is more
often a build error than a layout bug. The lines that mean "ready":

- back: `Listening on port: 3334` (preceded by the sqlite `CREATE TABLE IF NOT EXISTS ...` lines)
- front: `➜ Local: http://localhost:3333/` then `Nuxt Nitro server built`

On a cold start the front takes ~20s to answer 200 (Vite pre-bundling `mapbox-gl`, `axios`) and
reloads once right after (`optimized dependencies changed. reloading`): wait for that reload before
judging what is rendered.

### 1. Open the page

`navigate` to `http://localhost:3333`, then the route under test: `/` (homepage), `/articles` (list),
`/articles/:id` (article), `/admin`. No login: nothing is gated locally.

⚠️ `/admin` exposes destructive buttons ("SUPPRIMER TOUS LES ARTICLES", "SUPPRIMER & SYNCHRO") and a
Netlify build trigger. Never click them to "test" — read the DOM instead.

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

## Recontact gotchas

- Nuxt does SSR/SSG: a server/client divergence shows up in the console as a hydration mismatch —
  always read `read_console_messages` before concluding. **There is already one on startup**, on
  `<DefaultLayout>` (`Hydration node mismatch` + `Hydration completed but contains mismatches`):
  that is pre-existing noise, not proof your change broke something. Compare against a baseline
  before blaming a fix for it.
- The `<Suspense> is an experimental feature` warning and the Nuxt DevTools logs are normal noise too.
- The Mapbox map (`front/components/Homepage/Map/Map.vue`) needs `NUXT_PUBLIC_MAPBOX_TOKEN`; it ships
  in `front/.env.defaults`, so the map should render — if it is blank, `.env.local` was edited.
- The local database starts empty: `/api/articles` returns `[]`, article lists and the admin position
  are empty. That is not a CSS bug.
