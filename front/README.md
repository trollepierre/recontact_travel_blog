# recontact_travel_blog

> Travel blog of Pierre

## Build Setup

``` bash
# install dependencies
$ yarn install

# run tests
$ yarn test

# serve with hot reload at localhost:3334
$ yarn dev

# generate static project
$ yarn generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

# Frontend (Nuxt 3) - Scripts and use

## Development

- `yarn dev` (alias `yarn start`)
  - run Nuxt mode development on port 3333.
  - before, it assures that `.env.local` is created if it does not exist (copy of `.env.defaults`).

## Static Build (SSG)

- `yarn generate`
  - Build static website in `dist/` (SSG).
  - Netlify build is executed automatically:
    1) `node scripts/prerender-routes.mjs` (fetch routes dynamically with articles from API)
    2) `npx nuxi generate` (generated `dist/`)

## Netlify

- `netlify.toml`
  - `build.command = "node scripts/prerender-routes.mjs && npx nuxi generate"`
  - `publish = "dist"`
  - Redirect SPA: `/* -> /index.html 200`
- Rebuild manual from `/admin`
  - `AdminDashboard` contains hooks to call `/.netlify/functions/rebuild`.
  - Configure `NETLIFY_BUILD_HOOK_URL` needed.
