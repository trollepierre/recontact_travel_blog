# Recontact — développement local

Comment démarrer et faire tourner Recontact (front + back). La racine du dépôt **est** le monorepo :
front Nuxt 3 dans `front/`, back Node/Express dans `back/`.

## Runtime

- **Node `22.22.0`** (`.nvmrc`, `engines.node` du projet). Avec nvm :

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22.22.0
```

- Package manager : **Yarn 1** (`yarn@1.22.x`). Pas de pnpm sur ce projet.
- Si `yarn` est introuvable après `nvm use`, l'installer pour cette version Node : `npm install -g yarn@1.22.22`.

## Démarrage

```bash
# Back (API) — port 3334
cd back && yarn start:dev

# Front (Nuxt dev server) — port 3333
cd front && yarn start
```

Depuis la racine : `yarn start:dev` = back en dev (nodemon + babel-node) ; `yarn start:front` = front.
Attention : `yarn start` (racine ou `back/`) lance `node dist/index.js`, donc il faut avoir fait
`yarn build:back` avant — pour le dev, préférer `start:dev`.

Pour l'agent : `.claude/launch.json` expose les deux serveurs (`recontact-back`, `recontact-front`) à
`preview_start`, avec le `nvm use 22.22.0` déjà câblé.

- App : `http://localhost:3333`
- API : `http://localhost:3334` (`PORT` dans `back/.env.defaults`), routes sous `/api` —
  ex. `curl http://localhost:3334/api/articles`. `GET /` répond 404 : c'est normal, le back ne sert
  le front statique que si `dist/` est construit.

## Config / env

- Les deux projets ont un `prepare:env` (`scripts/ensure-env.mjs`), joué en `pre` hook de
  `dev` / `generate` / `start:dev` : il **copie `.env.defaults` vers `.env.local`** s'il n'existe pas.
  Le fichier à éditer en local est donc `back/.env.local` / `front/.env.local`, pas `.env`.
- Front, variables clés : `NUXT_ENV_API_URL` (défaut `http://localhost:3334`),
  `NUXT_ENV_LANGUAGE` (`fr` / `en`), `NUXT_PUBLIC_MAPBOX_TOKEN`.
- Le token Mapbox des defaults est fonctionnel : la carte de la homepage s'affiche sans config.
- Schéma des variables back : `back/.env.schema`.
- Base locale : SQLite, créée au démarrage (`back/src/db/data.development.sqlite`). Elle démarre
  **vide** : `/api/articles` renvoie `[]` et l'admin affiche `Dernière position connue : undefined`.
  PostgreSQL seulement pour reproduire un bug de prod.

## Install deps

```bash
yarn install          # racine : install:front + install:back
```

Si `front/node_modules` est vide ou corrompu :

```bash
cd front && yarn install --network-timeout 100000
```

## Tests & lint

```bash
yarn test        # back (mocha/nyc) puis front (jest)
yarn test:back
yarn test:front
yarn lint        # eslint front + back
yarn lint:fix
```

## Routes

- `/` — homepage (carte Mapbox + derniers articles)
- `/articles` — liste exhaustive
- `/articles/:id` — article et ses chapitres
- `/admin` — administration, **sans authentification en local**

⚠️ `/admin` contient des actions destructrices (« SUPPRIMER TOUS LES ARTICLES », « SUPPRIMER &
SYNCHRO ») et un déclencheur de build Netlify : ne pas cliquer ces boutons en vérifiant l'UI.

Le site est généré en statique par langue (`yarn generate:fr` / `yarn generate:en`) et déployé sur
Netlify ; le back est déployé sur Heroku.
