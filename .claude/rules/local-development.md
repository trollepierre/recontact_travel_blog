# Recontact — local development

How to start and run Recontact (front + back). The repo root **is** the monorepo:
Nuxt 3 front in `front/`, Node/Express back in `back/`.

## Runtime

- **Node `22.22.0`** (`.nvmrc`, project `engines.node`). With nvm:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22.22.0
```

- Package manager: **Yarn 1** (`yarn@1.22.x`). No pnpm on this project.
- If `yarn` is missing after `nvm use`, install it for that Node version: `npm install -g yarn@1.22.22`.

## Starting up

```bash
# Back (API) — port 3334
cd back && yarn start:dev

# Front (Nuxt dev server) — port 3333
cd front && yarn start
```

From the root: `yarn start:dev` = back in dev mode (nodemon + babel-node); `yarn start:front` = front.
Careful: `yarn start` (root or `back/`) runs `node dist/index.js`, so it needs a prior
`yarn build:back` — for development, prefer `start:dev`.

For the agent: `.claude/launch.json` exposes both servers (`recontact-back`, `recontact-front`) to
`preview_start`, with `nvm use 22.22.0` already wired in.

- App: `http://localhost:3333`
- API: `http://localhost:3334` (`PORT` in `back/.env.defaults`), routes under `/api` —
  e.g. `curl http://localhost:3334/api/articles`. `GET /` returns 404: that is expected, the back
  only serves the static front once `dist/` has been built.

## Config / env

- Both projects have a `prepare:env` step (`scripts/ensure-env.mjs`), run as a `pre` hook of
  `dev` / `generate` / `start:dev`: it **copies `.env.defaults` to `.env.local`** when missing.
  So the file to edit locally is `back/.env.local` / `front/.env.local`, not `.env`.
- Front, key variables: `NUXT_ENV_API_URL` (defaults to `http://localhost:3334`),
  `NUXT_ENV_LANGUAGE` (`fr` / `en`), `NUXT_PUBLIC_MAPBOX_TOKEN`.
- The Mapbox token in the defaults works: the homepage map renders with no extra setup.
- Back variable schema: `back/.env.schema`.
- Local database: SQLite, created on startup (`back/src/db/data.development.sqlite`). It starts
  **empty**: `/api/articles` returns `[]` and the admin page shows
  `Dernière position connue : undefined`. Use PostgreSQL only to reproduce a production bug.

## Installing deps

```bash
yarn install          # root: install:front + install:back
```

If `front/node_modules` is empty or broken:

```bash
cd front && yarn install --network-timeout 100000
```

## Tests & lint

```bash
yarn test        # back (mocha/nyc) then front (jest)
yarn test:back
yarn test:front
yarn lint        # eslint front + back
yarn lint:fix
```

## Routes

- `/` — homepage (Mapbox map + latest articles)
- `/articles` — full list
- `/articles/:id` — article and its chapters
- `/admin` — administration, **no authentication locally**

⚠️ `/admin` holds destructive actions ("SUPPRIMER TOUS LES ARTICLES", "SUPPRIMER & SYNCHRO") and a
Netlify build trigger: never click those buttons while checking the UI.

The site is statically generated per language (`yarn generate:fr` / `yarn generate:en`) and deployed
to Netlify; the back is deployed to Heroku.
