# Plan de mise à jour des dépendances

Objectif : réduire la surface de vulnérabilité réelle et sortir des dépendances
non maintenues, sans casser la CI ni la prod.

Audit de référence : `yarn audit` du **2026-09-03**, sur `dev` (`495232c`).
Node cible : **22.22.0** (`.nvmrc`, `engines`, `cimg/node:22.22.0`) — inchangé,
toutes les cibles ci-dessous sont compatibles Node 22.22.

---

## 1. État des lieux

| Périmètre         | critical | high | moderate | low | Total |
|-------------------|---------:|-----:|---------:|----:|------:|
| `back/`           |       32 |  148 |       70 |  28 |   278 |
| `front/`          |        1 |  261 |      102 |  35 |   399 |
| `tools/lighthouse`|       69 |  355 |      245 |  43 |   712 |

> Ces nombres comptent les **chemins** de dépendance, pas les paquets uniques :
> un même paquet vulnérable apparaît autant de fois qu'il a de parents. Le
> nombre brut est donc un mauvais indicateur — le tableau ci-dessous compte ce
> qui coûte vraiment.

### 1.1 Ce qui porte réellement le risque

**`back/` — 32 critical, concentrés sur 5 paquets :**

| Paquet | crit. | Origine | Nature |
|--------|------:|---------|--------|
| `vm2` | 21 | `dropbox@2.5.13` → `superagent-proxy@1` → `proxy-agent@2` → `pac-proxy-agent` → `pac-resolver` → `degenerator` → `vm2@3.10.0` **et** `node-mailjet@3.4.1` → `superagent-proxy@3` → `proxy-agent@5` → même chaîne | Évasions de sandbox / RCE. `vm2` est **abandonné par son auteur** : aucun correctif n'arrivera. |
| `sequelize` | 4 | direct, `5.21.7` | **Injections SQL** (`replacements`, `getWhereConditions`, raw attributes). Corrigé seulement en `>=6.37.4`. |
| `tar` | 3 | `sqlite3@5.1.7` → `tar@6.1.11` | Path traversal / DoS à l'extraction. Dev uniquement. |
| `form-data` | 3 | `superagent@3.8.3` (dropbox) et `superagent@7` (mailjet) | Frontière multipart générée par `Math.random()`. |
| `netmask` | 1 | même chaîne `pac-proxy-agent@2` | Parsing d'octal cassé. |

**`front/` — 1 critical (`tar`, via la chaîne Nuxt), mais 10 high sur `axios@0.21.4`**
(SSRF, prototype pollution, fuite de `Proxy-Authorization`, ReDoS sur cookies) —
`axios` est épinglé sur une version 0.x que le plan de correctifs amont a
laissée derrière.

**`tools/lighthouse` — 69 critical**, mais **zéro exposition** : outil de perf
CI, exécuté uniquement sur la branche `test`, jamais livré, jamais installé par
`yarn install`. Coût de correction faible, valeur réelle faible : c'est du bruit
de tableau de bord.

### 1.2 Ce qui est du bruit

Le gros des `high` des deux projets vient de quelques libs de build partagées,
comptées des dizaines de fois :

| Paquet | high+crit `back` | high+crit `front` | Réalité |
|--------|-----------------:|------------------:|---------|
| `minimatch` | 40 | 63 | ReDoS sur des globs — les globs viennent de **nos** configs, pas d'un attaquant |
| `brace-expansion` | 21 | 54 | idem |
| `picomatch` | 1 | 35 | idem |
| `browserslist` | 10 | 30 | crash sur un `browserslist-stats.json` hostile — on n'en a pas |
| `js-yaml` | 8 | 24 | DoS quadratique sur du YAML — on ne parse que nos fichiers |

Ces cinq paquets représentent **~80 % du décompte `high`** et **~0 % du risque
d'exploitation** : ils tournent au build, sur des entrées que nous contrôlons.
Ils ne doivent **pas** dicter l'ordre des travaux. Ils disparaîtront
mécaniquement en avançant l'outillage (ESLint, Jest, Babel, Nuxt), et
partiellement via les `resolutions` du § 5.

---

## 2. Contraintes structurantes découvertes

Ce sont elles qui déterminent le découpage. Chacune a été vérifiée sur le
registre npm ou dans le code.

1. **`sequelize.import()` n'existe plus en v6.**
   [`back/src/domain/models/index.js:20`](back/src/domain/models/index.js:20)
   charge les modèles avec `sequelize.import(...)`. Il faut passer à un
   `require()` explicite. C'est mécanique, mais bloquant.

2. **`pg` est en `devDependencies`** ([`back/package.json`](back/package.json))
   alors que la prod tourne en `dialect: 'postgres'`
   ([`models/index.js:12`](back/src/domain/models/index.js:12)). Si le build
   Heroku élague les devDependencies, la prod n'a pas son driver. **À vérifier
   avant tout le reste** — soit ça marche par accident, soit il y a une bombe à
   retardement.

3. **`eslint-config-airbnb-base@15` déclare `peer eslint: ^7 || ^8`** et n'a pas
   de release flat-config. Il **bloque ESLint 9 et 10** dans les trois projets.
   Passer ESLint 9+ = remplacer ou abandonner airbnb-base, pas juste bumper.

4. **`@vue/vue3-jest@29.2.6` déclare `peer jest: 29.x`** (dernière version
   publiée). Il **bloque Jest 30** sur le front. La sortie propre est
   **Vitest** (+ `@nuxt/test-utils`), natif dans l'écosystème Vite/Nuxt.

5. **La stack de test du back est une impasse CJS.** `sinon-chai@4` exige
   `chai ^5 || ^6`, or `chai@5+`, `sinon@22` et `date-fns@4` sont **ESM-only**,
   incompatibles avec la compilation Babel→CommonJS actuelle
   ([`back/babel.config.js`](back/babel.config.js)). Même problème pour
   `chalk@5+`. On reste donc volontairement sur `chai@4` / `sinon-chai@3` /
   `chalk@4` jusqu'à une éventuelle bascule ESM du back.

6. **Le chantier Nuxt 4 est un bloc indivisible.** `@pinia/nuxt@1` exige
   `pinia ^4.0.3`, qui exige `vue ^3.5.11` + `typescript >=5.6`, et
   `vue-router@5` exige `vite ^7.3` + `pinia ^3.0.4 || ^4`. On monte tout
   ensemble ou rien.

7. **`sqlite3@6.0.1` dépend toujours de `tar`.** Le bump ne supprime pas les
   3 critical `tar`, il les déplace au mieux. Et `sqlite3@6` exige
   `node-gyp 12.x` en peer.

---

## 3. Stratégie

- **Une PR par lot**, dans l'ordre ci-dessous, CI verte à chaque étape.
- Les lots 1 à 4 sont indépendants entre `back` et `front` : ils peuvent être
  menés en parallèle par deux personnes.
- On **ne touche pas** `yarn.lock` à la main. Chaque lot = modification de
  `package.json` + `yarn install` + commit du lock.
- Après chaque lot : `yarn lint && yarn test && yarn build`, puis
  `yarn audit --summary` archivé dans la description de PR pour tracer le delta.
- Les lots marqués **[sécu]** justifient un déploiement rapide ; les lots
  **[hygiène]** et **[outillage]** peuvent attendre.

---

## 4. Les lots

### Lot 0 — Vérification préalable `pg` [sécu / prod]

Avant tout : confirmer que le driver Postgres est bien présent en prod.

- Vérifier ce que le build Heroku installe réellement (`heroku run node -e "require('pg')"`).
- Si absent : déplacer `pg` de `devDependencies` vers `dependencies`.
- Déplacer aussi `sequelize-cli` et `sqlite3` explicitement en dev (déjà le cas)
  et documenter que `sqlite3` est **dev/test only**.

Aucune montée de version. PR minuscule, à faire en premier.

---

### Lot 1 — Nettoyage des dépendances fantômes [hygiène]

Suppressions sèches, aucun impact fonctionnel attendu.

`back/package.json` :

| Paquet | Version | Pourquoi le retirer |
|--------|---------|---------------------|
| `fs` | `0.0.2` | Squat npm. `fs` est un module natif Node. |
| `http` | `0.0.1-security` | Paquet placeholder de sécurité, vide. |
| `babel-core` | `7.0.0-bridge.0` | Pont Babel 6→7 pour l'ancien Jest. Le back tourne sous Mocha : inutile. |
| `babel-eslint` | `10.1.0` | **Déprécié** par l'amont. Remplacé par `@babel/eslint-parser` (déjà utilisé par le front). |
| `debug` | `4.4.3` | Dépendance transitive de `sequelize`/`express`, épinglée en direct sans usage propre. |

`front/package.json` :

| Paquet | Version | Pourquoi le retirer |
|--------|---------|---------------------|
| `lolex` | `6.0.0` | **Déprécié**, remplacé par `@sinonjs/fake-timers`. Aucun `import` dans le code. |
| `levenary` | `^1.1.1` | Transitive de Babel, épinglée sans usage. |
| `to-fast-properties` | `3.0.1` | idem. |
| `escape-string-regexp` | `1.0.5` | idem, et bloquée en 1.x. |

À traiter séparément (demande du travail de code) :

- **`vuex@^4.1.0`** n'est plus utilisé qu'**au sein des tests**
  (`front/components/**/*.spec.js`, `front/layouts/default.spec.js`) alors que le
  store de production est Pinia (`front/stores/app.ts`). Il reste aussi un
  `front/store/index.js` legacy. → migrer ces specs vers Pinia
  (`@pinia/testing`), supprimer `front/store/` et `vuex`. **Lot dédié**, voir 6bis.
- **`vue-router`** en `devDependencies` du front : Nuxt le fournit déjà. À
  retirer du `package.json` (il reste résolu comme transitive de Nuxt).

Vérifier ensuite : `yarn lint && yarn test` sur les deux projets.

---

### Lot 2 — `back` : sortir de la chaîne `vm2` [sécu] ⭐ priorité maximale

**Gain : ~24 des 32 critical du back**, dont 21 RCE sur un paquet abandonné.

| Paquet | De | Vers |
|--------|----|------|
| `dropbox` | `2.5.13` | `10.46.0` |
| `node-mailjet` | `3.4.1` | `6.0.11` |

Pourquoi ça marche : `dropbox@10.46.0` a **zéro dépendance** (le SDK utilise
`fetch` natif) et `node-mailjet@6` ne dépend plus que de `axios`, `url-join`,
`json-bigint`. Les deux chaînes `superagent-proxy → proxy-agent → pac-resolver →
degenerator → vm2 / netmask / form-data@2` disparaissent entièrement.

**Travail de code — `back/src/infrastructure/external_services/dropbox-client.js` :**

- Import : `import Dropbox from 'dropbox'` → `import { Dropbox } from 'dropbox'`
  (export nommé depuis la v5).
- **Toutes les réponses sont enveloppées** en `{ status, headers, result }`.
  Chaque accès devient `response.result.*` :
  - `filesListFolderContinue(...)` → `.result.has_more`, `.result.entries`, `.result.cursor`
  - `filesListFolder(...)` → `.result.entries`
  - `filesGetTemporaryLink(...)` → `.result.link`
  - `sharingCreateSharedLink(...)` → **déprécié côté API Dropbox**, remplacer par
    `sharingCreateSharedLinkWithSettings({ path })`.
- La logique de retry `ECONNRESET` (`createSharedLink`) est à revoir : les
  `setTimeout` actuels ne sont pas awaités, les retries partent dans le vide et
  la fonction résout `{}` immédiatement. À corriger à cette occasion.

**Travail de code — `back/src/infrastructure/mailing/mailjet.js` :**

- `nodeMailjet.connect(pub, secret)` **n'existe plus** →
  `new Mailjet({ apiKey, apiSecret })`.
- Import : `import Mailjet from 'node-mailjet'`.
- Le payload legacy v3 (`FromEmail` / `Recipients` / `Html-part`) reste accepté
  par l'API via `.post('send').request(...)`. **Décider** : conserver le format
  v3 (diff minimal) ou migrer vers v3.1 (`Messages: [{ From, To, Subject, HTMLPart }]`,
  format supporté à long terme). Recommandation : format v3 dans ce lot,
  migration v3.1 dans un lot séparé pour ne pas mélanger les risques.

**Tests à surveiller :** les stubs Sinon de `dropbox-client` et `mailjet`
(dossier `back/test/`) portent sur les signatures modifiées.

**Risque :** moyen. Deux intégrations externes touchées, mais la surface est
petite et bien isolée (un fichier chacune). Les mails ne partent pas hors prod
(`isProduction()` court-circuite `sendEmail`), donc à tester en staging.

---

### Lot 3 — `back` : Sequelize 5 → 6 [sécu] ⭐

**Gain : les 4 critical restants du back**, dont deux injections SQL sur le
chemin de code de production.

| Paquet | De | Vers |
|--------|----|------|
| `sequelize` | `5.21.7` | `6.37.8` (dernier v6 ; v7 encore en pré-release) |

**Travail de code :**

- [`back/src/domain/models/index.js:20`](back/src/domain/models/index.js:20) :
  `sequelize.import(path)` supprimé en v6 →
  ```js
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
  ```
  Les modèles (`article.js`, `comment.js`, …) exportent déjà la bonne signature
  `(sequelize, DataTypes) => ...` : ils n'ont pas à changer.
- **Bluebird disparaît** : Sequelize 6 utilise les promesses natives.
  `Sequelize.Promise` n'existe plus. Vérifier qu'aucun `.finally`/`.spread`/
  `.tap` Bluebird ne traîne dans `back/src/`.
- Les **alias d'opérateurs** (`$gt`, `$in`, …) sont supprimés. Le code n'en
  utilise pas, mais vérifier les migrations
  (`back/src/infrastructure/db/migrations/`).
- Effet de bord positif : Sequelize 5 épinglait `lodash@^4.17.15` en doublon du
  `lodash@4.18.1` racine. Le doublon disparaît, ainsi que les advisories
  `lodash` qui allaient avec.

**Tests / migrations :** rejouer `yarn init:db` sur SQLite local, puis vérifier
les migrations sur une copie de la base Postgres de staging avant prod.

**Risque :** moyen-élevé — c'est l'ORM. Mais l'API utilisée est basique
(`define`, `findAll`, `findOne`, `create`, `update`, `destroy`) et v5→v6 est la
transition la mieux documentée de Sequelize.

---

### Lot 4 — `back` : Express et le middleware HTTP [sécu]

**Gain : les 4 high `path-to-regexp` + `send`, `serve-static`, `cookie`, `qs`,
`body-parser`** — c'est-à-dire les seules vulnérabilités du back exposées
directement sur une requête entrante.

| Paquet | De | Vers | Note |
|--------|----|------|------|
| `express` | `4.18.2` | `4.22.2` | **Même majeure, aucun breaking change.** Remonte `path-to-regexp` ≥0.1.13, `send` ≥0.19, `serve-static` ≥1.16, `cookie` ≥0.7, `qs`, `body-parser` ≥1.20.6. |
| `body-parser` | `1.20.3` | `1.20.6` | Épinglé en direct alors qu'Express le fournit. **Le retirer** plutôt que le bumper (`app.js` peut utiliser `express.json()` / `express.urlencoded()`). |
| `connect-history-api-fallback` | `1.6.0` | `2.0.0` | v2 ne change que le format d'options ; l'usage dans `app.js:54` est un simple `history(req, res, next)`. |
| `cookie-parser` | `1.4.7` | `1.4.7` | Déjà à jour. |
| `cors` | `^2.8.6` | `^2.8.6` | Déjà à jour. |
| `morgan` | `^1.11` | `^1.12` | Semver-safe. |

**Express 5 : pas dans ce lot.** Les routes sont toutes des chaînes simples
(`app.use('/api/articles', …)`), donc la migration est faisable, mais elle
change le parsing de `req.query`, la syntaxe `path-to-regexp@8` et supprime des
alias. Aucun gain sécurité par rapport à `4.22.2`. → lot ultérieur, quand il n'y
aura plus rien de plus rentable à faire.

**Bug préexistant à corriger au passage :**
[`back/app.js:85`](back/app.js:85) déclare le gestionnaire d'erreurs avec
**3 arguments** `(err, req, res)`. Express identifie les error handlers à leur
arité **4** : ce middleware n'est donc jamais appelé en tant que tel, et toute
erreur remonte au handler par défaut. À passer en `(err, req, res, next)`.

---

### Lot 5 — `front` : sortir d'`axios@0.21.4` [sécu] ⭐

**Gain : les 10 high `axios`** (SSRF, prototype pollution, fuite de
`Proxy-Authorization`, ReDoS cookies, null-byte injection).

| Paquet | De | Vers |
|--------|----|------|
| `axios` | `0.21.4` (épinglé) | `^1.20.0` |
| `axios-extensions` | `^3.1` | `^4.0.0` (`peer axios: >=1.0.0`) |

**Travail de code —
[`front/services/services/api-service.js`](front/services/services/api-service.js) :**

- `adapter: cacheAdapterEnhancer(axios.defaults.adapter)` : en axios 1.x,
  `axios.defaults.adapter` est un **tableau de noms d'adapters**, plus une
  fonction. Il faut résoudre l'adapter explicitement
  (`axios.getAdapter(axios.defaults.adapter)`) ou passer `'xhr'`/`'fetch'`.
- Les erreurs axios 1.x sont des `AxiosError` : `error.message` reste valide
  (le `logger.error(error.message)` ne change pas), mais vérifier les specs
  `api-service.spec.js` et `api-service.error.spec.js` qui assertent sur la
  forme de l'erreur.

**Alternative à considérer, plus radicale :** `ofetch@^1.5.1` est déjà dans les
dépendances (fourni par Nuxt) et couvre tout l'usage de ce fichier —
`get/post/patch/delete` + `baseURL` + headers. Supprimer `axios` **et**
`axios-extensions` élimine la dette d'un coup, au prix d'une réécriture d'un
fichier de 60 lignes et de ses deux specs, et de la perte du cache
`cacheAdapterEnhancer` (à remplacer par le cache HTTP `Cache-Control` déjà
positionné, ou par `useFetch`/`useAsyncData` de Nuxt).

→ **Recommandation : basculer sur `ofetch`.** Le back utilise déjà
`axios@^1.19`, donc garder axios sur le front n'apporte aucune mutualisation, et
`axios` a produit 10 high en un seul cycle d'audit.

---

### Lot 6 — `front` : montée Nuxt 4 [outillage + sécu]

Bloc **indivisible** (cf. contrainte §2.6). Gain sécurité : les `high`/`moderate`
sur `vite`, `postcss`, `defu`, `rollup`, `ws`, `nanoid`, `js-cookie` — tous
transitifs de Nuxt.

| Paquet | De | Vers |
|--------|----|------|
| `nuxt` | `^3.21` | `^4.5.2` |
| `pinia` | `^2.1.7` | `^4.0.3` |
| `@pinia/nuxt` | `^0.5.1` | `^1.0.2` |
| `vue` | `^3.5` | `^3.5.42` |
| `@vue/server-renderer` | `^3.5` | `^3.5.42` (garder aligné sur `vue`) |
| `vue-i18n` | `^9.8.0` | `^11.4.10` |
| `typescript` | `^5.0.2` | `^5.6` minimum (peer de `pinia@4`) |
| `mapbox-gl` | `^2.15.0` | `^3.29.0` |

Points d'attention :

- **`nuxt.config.ts`** : `compatibilityDate: '2026-01-16'` est déjà posé, mais
  Nuxt 4 change l'arborescence par défaut (`app/` dir). Vérifier s'il faut
  `future.compatibilityVersion` ou conserver la structure v3 via `srcDir`.
- **`vue-i18n` 9 → 11** : deux majeures. Vérifier le mode `legacy: false`, le
  format des messages et le contenu de `front/locales/`.
- **`mapbox-gl` 2 → 3** : la CSS est chargée en dur
  (`~/assets/css/mapbox-v2.0.1.css` dans `nuxt.config.ts`) → à remplacer par
  celle de la v3. Noter aussi que mapbox-gl ≥2 est sous **licence propriétaire**
  (pas open source) : si c'est un problème, `maplibre-gl` est le fork libre.
- **`pinia` 2 → 4** : deux majeures, mais l'usage (`front/stores/app.ts`) est un
  seul store. Faible surface.

**Risque : élevé.** C'est le lot le plus long. À faire seul, sur une branche
dédiée, avec vérification visuelle du site généré (`yarn generate:fr` +
`yarn generate:en`) et des deux déploiements Netlify.

---

### Lot 6bis — `front` : supprimer Vuex [hygiène]

Dépend du lot 1. Les specs listées au §Lot 1 importent encore `Vuex` alors que
la prod est sur Pinia.

- Migrer `ArticleList.spec.js`, `ChapterCard.spec.js`, `DarkModeToggle.spec.js`,
  `NewModeToggle.spec.js`, `CommentCard.spec.js`, `ArticleCard.spec.js`,
  `ArticlePage.spec.js`, `layouts/default.spec.js` vers `@pinia/testing`.
- Supprimer `front/store/` (legacy) et sa spec.
- Retirer `vuex` de `devDependencies`.

Gain sécurité nul, gain de lisibilité et de temps d'installation réel. À faire
**avant** le lot 6 si possible : ça réduit le bruit pendant la montée Nuxt 4.

---

### Lot 7 — `front` : Jest 29 → Vitest [outillage]

Bloqué par `@vue/vue3-jest` (contrainte §2.4). Deux options :

**Option A — rester sur Jest 29 (statu quo).** Coût nul, mais on gèle
`jest`, `jest-environment-jsdom`, `babel-jest`, `@vue/vue3-jest` et on garde
Babel dans la boucle de test alors que Nuxt compile déjà avec Vite.
Corriger tout de même l'incohérence : `pretty-format` est en `^30.4` alors que
Jest est en 29 → aligner sur `^29`.

**Option B — migrer vers Vitest** (recommandée, après le lot 6).
Supprime `jest`, `jest-environment-jsdom`, `babel-jest`, `@vue/vue3-jest`,
`jest-serializer-vue`, `pretty-format`, et probablement tout `babel.config.js`
+ `@babel/*` du front (7 paquets). Ajoute `vitest`, `@vitest/coverage-v8`,
`@nuxt/test-utils`, `jsdom`.

À traduire : `front/config/jest.config.json` (`moduleNameMapper` → `alias`,
`snapshotSerializers`, `coverageThreshold`), les 5 fichiers de mock
`front/config/jest.*.js`, et le script `test:front:ci` de la racine
(`--maxWorkers=25%` → `--pool=threads`).

**Risque : moyen.** ~30 fichiers de specs, mais l'API `describe/it/expect` est
compatible et `@vue/test-utils@2` fonctionne à l'identique. Les snapshots
devront être régénérés.

---

### Lot 8 — ESLint 8 → 9/10 et Prettier 2 → 3 [outillage]

Bloqué par `eslint-config-airbnb-base` (contrainte §2.3), qui n'a pas de
version flat-config et plafonne à `eslint ^8`.

Prérequis : décider du remplacement. Trois pistes, par ordre de coût croissant
d'écriture de règles :

1. `eslint-config-airbnb-extended` (portage flat-config communautaire d'airbnb) ;
2. `@eslint/js` `recommended` + notre `.eslintrc.js` racine (qui contient déjà
   ~40 règles maison) porté en flat config + `eslint-plugin-vue@10` ;
3. abandonner les règles de style au profit de Prettier seul + un jeu de règles
   ESLint réduit aux erreurs réelles.

Piste 3 recommandée : les règles de
[`.eslintrc.js`](.eslintrc.js) sont à 80 % du formatage (`comma-dangle`,
`quotes`, `semi`, `padded-blocks`, `object-curly-spacing`, …) que Prettier gère
déjà. Le doublon coûte des conflits à chaque montée de version.

Cibles une fois débloqué :

| Paquet | De | Vers | Périmètre |
|--------|----|------|-----------|
| `eslint` | `8.57.1` | `^10.9` | racine, front, back, lighthouse |
| `eslint-plugin-vue` | `9.33.0` | `^10.10` | front (peer : `vue-eslint-parser ^10.3`) |
| `eslint-plugin-jest` | `26.9.0` | `^29.16` | front (ou supprimé avec le lot 7) |
| `prettier` | `^2.x` | `^3.9` | racine + front |
| `@babel/eslint-parser` | `^7.29` | `^8` | front, back (remplace `babel-eslint`) |

**Prettier 3 reformate tout le dépôt** (les guillemets, les parenthèses de
fonctions fléchées, les trailing commas). À faire dans un **commit de
reformatage isolé**, ajouté à `.git-blame-ignore-revs`.

**Risque : faible techniquement, élevé en volume de diff.** Aucun gain
sécurité direct — c'est ce lot qui fera tomber le gros du bruit
`minimatch`/`brace-expansion` du §1.2, mais ce n'est pas une raison de le
prioriser.

---

### Lot 9 — `back` : Babel 7 → 8 et outillage de test [outillage]

Le back a des `@babel/*` figés en **7.14.x** (mai 2021) alors que le front est
en 7.28/7.29. Incohérence à résorber.

| Paquet | De | Vers | Note |
|--------|----|------|------|
| `@babel/core` | `7.23.3` | `^8.0.1` | `engines: ^22.18 || >=24.11` → OK sur 22.22 |
| `@babel/cli` | `7.14.3` | `^8.0.4` | |
| `@babel/node` | `7.14.2` | `^8.0.1` | |
| `@babel/preset-env` | `7.14.2` | `^8.0.2` | |
| `@babel/plugin-transform-runtime` | `7.14.3` | `^8.0.1` | |
| `@babel/register` | `7.18.9` | `^8.0.1` | |
| `mocha` | `8.4.0` | `^12.0.0` | 4 majeures ; `engines >=22.12` OK |
| `nyc` | `15.1.0` | `^18.0.0` | ou remplacer par `c8` (natif V8, plus léger) |
| `nodemon` | `2.0.7` | `^3.1.14` | dev seulement |
| `supertest` | `6.1.3` | `^7.2.2` | |
| `sequelize-cli` | `^6.6` | `^6.6.5` | déjà à jour |
| `dotenv-extended` | `2.9.0` | `^3.1.0` | `engines >=20` OK |
| `dotenv` (dev) | `10.0.0` | `^17.4.2` | idem côté front |
| `date-fns` | `2.30.0` | *à évaluer* | v4 est `type: module` ; vérifier que `require('date-fns/fp')` ([`date-utils.js:1`](back/src/domain/utils/date-utils.js:1)) survit à la compilation Babel→CJS avant de bumper |

**Gelés volontairement** (cf. contrainte §2.5) :

| Paquet | Version tenue | Raison |
|--------|---------------|--------|
| `chai` | `^4.5.0` | `chai@5+` est ESM-only |
| `sinon-chai` | `^3.7` | `v4` exige `chai ^5` |
| `sinon` | `^11` → à tester en `^17` max | `sinon@22` est `type: module` |
| `chalk` | `^4.1.2` | `chalk@5+` est ESM-only |
| `@sinonjs/fake-timers` | `^11` → `^15` à tester | vérifier la compat CJS |

Sortir de ces gels = basculer le back en ESM (supprimer Babel, `"type": "module"`),
ou remplacer Mocha+Chai+Sinon par **Vitest** (cohérent avec le lot 7). C'est un
chantier à part entière, à décider une fois les lots 0–5 livrés.

---

### Lot 10 — `tools/lighthouse` [hygiène]

69 critical, aucune exposition. Deux options :

**Option A — bumper.** `lighthouse` 10.4.0 → `^13.4.1` (`engines >=22.19`, OK),
`chrome-launcher` 0.15.2 → `^1.2.1`, `jest` 25.1.0 → `^30`, `eslint` 5.16.0 →
aligné sur le lot 8. Fait tomber les 69 critical d'un coup, ~30 min de travail.

**Option B — supprimer.** Le job `lighthouse` de
[`.circleci/config.yml`](.circleci/config.yml) ne tourne que
`filters: branches: only: test`, comme `bundlesize`. Si personne ne pousse sur
`test`, ce dossier est du code mort qui gonfle le badge Snyk. Le remplaçant
naturel est **Lighthouse CI** (`@lhci/cli`) ou l'audit Lighthouse intégré à
Netlify, sans dossier ni lockfile à maintenir.

→ **Trancher d'abord l'usage réel de la branche `test`.** Si elle est morte,
supprimer `tools/lighthouse`, `tools/webpagetest-*.json`,
`bundlesize.config.json` et les jobs CI correspondants : c'est le meilleur
ratio lignes-supprimées / risque-éliminé de tout ce plan.

---

## 5. Filet transitif : `resolutions`

Pour ce qui ne dépend d'aucune de nos dépendances directes, Yarn 1 permet de
forcer une version. **Uniquement quand le correctif est un patch dans la même
majeure** — forcer une majeure sur un consommateur qui attend l'ancienne API
casse le build silencieusement.

**À appliquer après le lot 2** : tant que `dropbox@2` et `node-mailjet@3` sont
là, `form-data` est consommé en `^2` et `^3` par `superagent`, et le forcer en
`^4` casserait l'upload. Le lot 2 supprime ces consommateurs.

À ajouter dans `back/package.json` et `front/package.json` :

```json
"resolutions": {
  "brace-expansion": "^2.1.4",
  "browserslist": "^4.28.7",
  "flatted": "^3.4.2",
  "form-data": "^4.0.6",
  "nanoid": "^3.3.18",
  "cross-spawn": "^7.0.5",
  "semver": "^7.5.2",
  "postcss": "^8.5.23",
  "defu": "^6.1.5",
  "js-cookie": "^3.0.7",
  "ws": "^8.21.0",
  "validator": "^13.15.22",
  "serialize-javascript": "^7.0.5",
  "qs": "^6.16.0",
  "cookie": "^0.7.2"
}
```

**Volontairement absents** — le forçage y serait plus dangereux que la faille :

| Paquet | Pourquoi pas de `resolution` |
|--------|------------------------------|
| `minimatch` | Correctifs répartis sur 3.1.4 / 5.1.8 / 9.0.6 / 10.2.3. `minimatch@10` est ESM et casse les consommateurs 3.x. |
| `js-yaml` | `v4` a supprimé `safeLoad`/`safeDump` : forcer 4 sur un consommateur 3.x casse à l'exécution. |
| `tar` | Le back a besoin de `>=7.5.21`, mais `sqlite3` exige `tar ^6` (API différente). Résolu par le lot 10 / le passage à `better-sqlite3`. |
| `picomatch` | Même problème que `minimatch` : correctifs en `2.3.2` **et** `4.0.4`. Le front consomme les deux majeures (35 chemins). |
| `lodash` | Déjà en `4.18.1` à la racine ; le doublon `4.17.x` vient de Sequelize 5 et disparaît au lot 3. |

Après application, relancer `yarn install && yarn test && yarn build` sur chaque
projet : une `resolution` mal placée se voit au build, pas à l'install.

---

## 6. Remettre en place la veille

**C'est la cause racine de la dérive.** Aujourd'hui :

- [`.github/dependabot.yml`](.github/dependabot.yml) est **entièrement
  commenté** (commits `727254c`, `495232c`) ;
- [`.github/renovate.json`](.github/renovate.json) a `"enabled": false`.

Les deux sont éteints, d'où l'état actuel. Sans réactivation, ce plan sera à
refaire dans dix-huit mois.

**Recommandation : réactiver Renovate seul** (pas les deux, ils se marchent
dessus), configuré pour ne pas noyer le dépôt :

```json
{
  "enabled": true,
  "extends": ["config:recommended"],
  "addLabels": ["dependencies"],
  "schedule": ["after 10pm and before 5am on every weekday", "every weekend"],
  "prConcurrentLimit": 3,
  "packageRules": [
    {
      "matchUpdateTypes": ["patch", "minor"],
      "matchDepTypes": ["devDependencies"],
      "groupName": "dev deps (patch+minor)",
      "automerge": true
    },
    { "matchUpdateTypes": ["patch"], "groupName": "patches", "automerge": true },
    { "matchPackageNames": ["@babel/**"], "groupName": "babel" },
    { "matchPackageNames": ["nuxt", "vue", "pinia", "@pinia/nuxt", "vue-router", "vue-i18n"], "groupName": "nuxt+vue" },
    { "matchPackageNames": ["eslint", "eslint-**", "prettier"], "groupName": "lint" },
    { "matchUpdateTypes": ["major"], "dependencyDashboardApproval": true }
  ],
  "vulnerabilityAlerts": { "labels": ["security"], "automerge": false }
}
```

Ce qui change par rapport à l'ancienne config : les patches et devDeps
s'automergent une fois la CI verte (plus de PR à traiter à la main), les majeures
attendent une approbation explicite via le Dependency Dashboard (plus de PR
cassées qui pourrissent), et les groupes évitent les 15 PR Babel simultanées qui
avaient conduit à tout désactiver.

**Ajouter aussi un garde-fou en CI**, job non bloquant au début :

```yaml
  audit:
    <<: *common_properties
    steps:
      - run: echo "${CIRCLE_BRANCH}_${CIRCLE_SHA1}" > .circle-cache-key
      - restore_cache:
          keys:
            - v16-code-{{ checksum ".circle-cache-key" }}
      - run:
          name: Audit back
          command: cd back && yarn audit --level critical
      - run:
          name: Audit front
          command: cd front && yarn audit --level critical
```

`yarn audit` sort en code non nul dès qu'il trouve quelque chose au niveau
demandé. Commencer à `--level critical` (atteignable : 0 après les lots 2, 3, 10),
puis resserrer à `high` quand ce sera tenable.

---

## 7. Ce qu'on ne fait pas, et pourquoi

| Renoncement | Raison |
|-------------|--------|
| **Express 5** | Aucun gain sécurité sur `4.22.2`. Breaking changes réels (`req.query`, `path-to-regexp@8`). À reconsidérer plus tard. |
| **Sequelize 7** | Pas de release stable sur le tag `latest`. `6.37.8` corrige tous les critical. |
| **`chai` 5/6, `sinon` 22, `chalk` 5/6, `date-fns` 4** | ESM-only, incompatibles avec la compilation Babel→CJS du back (§2.5). Nécessitent une bascule ESM préalable. |
| **`typescript` 7** | Le front n'a du TS que dans `nuxt.config.ts` et `stores/app.ts`. Un saut de majeure pour ça n'est pas rentable ; s'aligner sur le peer de `pinia@4` (`>=5.6`) suffit. |
| **Yarn 1 → Yarn 4** | `yarn@1.22` est en fin de vie et son `audit` est bruyant, mais migrer touche `engines`, les 4 lockfiles, la CI CircleCI et le build Heroku. Chantier séparé, à faire après ce plan. |
| **Node 22 → 24** | Node 22.22 satisfait toutes les cibles de ce plan. Reporter le bump pour ne pas coupler deux sources de casse. |
| **Chasser `minimatch`/`brace-expansion`/`js-yaml`/`picomatch`** | ~80 % du décompte `high`, ~0 % du risque exploitable : ils tournent au build sur nos propres entrées (§1.2). Ils tomberont avec les lots 7, 8 et 9. |

---

## 8. Ordre d'exécution

| # | Lot | Périmètre | Gain sécurité | Risque | Effort |
|---|-----|-----------|---------------|--------|--------|
| 0 | Vérif `pg` en prod | back | — (évite une panne) | faible | 15 min |
| 1 | Paquets fantômes | back + front | — | très faible | 1 h |
| 2 | `dropbox` + `node-mailjet` | back | **~24 critical** | moyen | 1 j |
| 3 | `sequelize` 5→6 | back | **4 critical** (injection SQL) | moyen-élevé | 1–2 j |
| 4 | Express 4.22 + middlewares | back | 4 high exposés HTTP | faible | 3 h |
| 5 | `axios` → `ofetch` | front | **10 high** | faible-moyen | 4 h |
| 10 | `tools/lighthouse` | tools | 69 critical (non exposés) | très faible | 30 min – 1 h |
| 6bis | Supprimer Vuex | front | — | faible | 3 h |
| 6 | Nuxt 4 + écosystème Vue | front | high transitifs Vite/PostCSS | **élevé** | 3–5 j |
| 7 | Jest → Vitest | front | indirect | moyen | 2 j |
| 8 | ESLint 10 + Prettier 3 | tous | indirect (gros du bruit) | faible / gros diff | 2 j |
| 9 | Babel 8 + outils de test back | back | indirect | moyen | 2 j |
| — | `resolutions` (§5) | back + front | high transitifs ciblés | faible | 1 h |
| — | Réactiver Renovate + job audit (§6) | racine | **structurel** | faible | 2 h |

**Cible après les lots 0 à 5 + 10 : `critical` = 0** sur les trois périmètres.

**Livrable minimal si le temps manque : lots 0, 2, 3, 4, 5 et la réactivation de
Renovate.** C'est là qu'est tout le risque réellement exploitable ; le reste est
de l'hygiène et du décompte.

---

## 9. Vérification, à chaque lot

```bash
yarn install
yarn lint
yarn test
yarn build
```

Puis, dans `back/` et `front/` :

```bash
yarn audit --summary
```

Et pour les lots qui touchent la prod (2, 3, 4) : déploiement sur
`recontact-test` (Heroku staging, branche `dev`) avant `master`, avec
vérification manuelle de la synchronisation Dropbox et de l'envoi d'un mail
Mailjet — les deux seules intégrations externes non couvertes par les tests.
