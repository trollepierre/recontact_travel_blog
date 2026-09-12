# Dépendances : état après la passe sécurité, et suite

Ce fichier remplace le plan initial (commit `aaa5a6e`). Le plan est exécuté pour
tout ce qui portait du risque exploitable ; ce qui reste est listé au § 4 avec
les blocages vérifiés sur le registre npm le **2026-09-11**.

Node cible : **22.22.0** — inchangé.

---

## 1. Où on en est

`yarn audit`, après la passe :

| Périmètre          | avant (2026-09-03) | après | critical avant → après |
|--------------------|-------------------:|------:|-----------------------:|
| `back/`            | 278                | 86    | 32 → **0**             |
| `front/`           | 399                | 240   | 1 → **0**              |
| `tools/lighthouse` | 712                | 0     | 69 → **0**             |

**`critical` = 0 sur les trois périmètres**, l'objectif que le plan initial
fixait aux lots 0 à 5 + 10.

Ce qui reste est du `high` de build : `minimatch`, `js-yaml`, `picomatch`,
`ansi-regex`, `braces` côté back (32 / 12 / 1 / 11 / 3 chemins) et `minimatch`,
`js-yaml`, `picomatch` côté front (63 / 36 / 35). Tous tournent au build, sur
des globs et du YAML que nous écrivons nous-mêmes — voir § 4.8.

Ce qui a été livré, un commit par lot :

| Commit    | Lot | Contenu |
|-----------|-----|---------|
| `777db94` | 0   | `pg` déplacé en `dependencies` |
| `88d17d0` | 1   | paquets fantômes supprimés |
| `604a9d8` | 2   | `dropbox` 2→10, `node-mailjet` 3→6, sortie de `vm2` |
| `4920b6f` | 3   | `sequelize` 5.21.7 → 6.37.8 |
| `aa6542a` | 4   | `express` 4.18.2 → 4.22.2 + middlewares |
| `6917ab5` | 5   | `axios` → `ofetch` sur le front |
| `f025aff` | 10  | `tools/lighthouse` remis à niveau |
| `3889c15` | §5  | `resolutions` transitives |
| `15f54f1` | §5  | `sqlite3` 5→6, `tar` épinglé, `strip-ansi` épinglé |
| `3ced821` | CI  | `lighthouse` et `bundlesize` rendus atteignables |
| `4e66759` | CI  | les trois jobs que la branche `test` a révélés |
| `0395b2b` | CI  | nom de commande de l'orbe `browser-tools` |

---

## 2. Vérifications encore dues (non couvertes par les tests)

À faire sur `recontact-test` (Heroku staging, branche `dev`) **avant** `master` :

1. **Synchronisation Dropbox complète.** Le SDK v10 enveloppe toutes les
   réponses et `sharingCreateSharedLink` a été remplacé par
   `sharingCreateSharedLinkWithSettings` + repli sur `sharingListSharedLinks`.
   Vérifier en particulier un article **déjà synchronisé** : c'est lui qui passe
   par le repli, et c'est le seul chemin non couvert par les tests unitaires.
2. **Envoi d'un mail Mailjet réel.** `sendEmail` est court-circuité hors
   production (`isProduction()`), donc aucun test ne touche l'API.
3. **Le comportement de `sequelize.sync()` sur le Postgres réel.**
   Attention, **les migrations ne sont jamais jouées** : il n'y a ni
   `.sequelizerc` ni `config/config.json`, aucun script n'appelle `db:migrate`,
   et le dossier `back/src/infrastructure/db/migrations/` a divergé des modèles
   (il crée `Chapters` alors que le modèle veut `Newchapters`, et ne connaît ni
   `Comments`, ni `Photos`, ni `Newpositions`). C'est
   [`back/index.js:24`](back/index.js:24) qui fait le schéma, avec un
   `models.sequelize.sync()` à chaque démarrage.

   Ce qu'il faut donc vérifier, ce n'est pas un rejeu de migrations mais que
   `sync()` sous Sequelize 6 ne touche à rien sur le schéma existant — sans
   `force` ni `alter`, il se limite à des `CREATE TABLE IF NOT EXISTS`, donc un
   diff de schéma avant/après doit être **vide** — puis que les lectures et
   écritures passent. Le round-trip CRUD n'a été validé que sur SQLite.

   Note : la connexion production impose TLS, donc une copie posée sur un
   Postgres local sans TLS refusera la connexion ; faire la vérification sur une
   base hébergée, ou lever le SSL le temps du test.

   **Le déploiement de branche a déjà servi à ça** : `recontact-branch` faisait
   `SELF_SIGNED_CERT_IN_CHAIN` au démarrage. Cause trouvée et corrigée, voir
   § 5.9 — c'était une régression de cette passe, qui aurait cassé la prod au
   déploiement. Redéployer la branche pour confirmer.
4. **Réponses d'erreur de l'API.** Le gestionnaire d'erreurs d'`app.js` était
   inerte (arité 3) ; il répond maintenant `{ error: <message> }` en JSON là où
   Express renvoyait sa page HTML par défaut. Vérifier qu'aucun client ne
   dépendait du HTML.

---

## 3. Corrections au plan initial

Points du plan qui se sont révélés faux à l'exécution — à ne pas rejouer :

| Affirmation du plan | Réalité |
|---------------------|---------|
| `debug` (back) est épinglé sans usage propre | Il est importé par `index.js:6`. Conservé. *(voir § 5, l'appel y est bogué)* |
| `vue-router` peut sortir du `package.json` du front | Il est importé directement par `config/jest.setup.js` et `test/router/router.js` ; le retirer fait échouer `import/no-extraneous-dependencies`. Conservé. |
| Remplacer `sharingCreateSharedLink` est mécanique | La route `WithSettings` **échoue** quand le lien existe déjà, là où l'ancienne renvoyait l'existant. Sans repli sur `sharingListSharedLinks`, toute resynchronisation perdait ses liens d'images. |
| Le lot 10 est un simple bump | `lighthouse ≥ 12` et `chrome-launcher ≥ 1` sont ESM-only : `tools/lighthouse` est passé en `"type": "module"`, **jest a été retiré** au profit du runner intégré de Node (cf. § 5.7), la catégorie **PWA a disparu de Lighthouse 12** (4 assertions supprimées) et une catégorie **« Agentic Browsing » est apparue en 13** (exclue de l'agrégat). |
| `sqlite3@6` « ne supprime pas les 3 critical `tar` » | Faux : `sqlite3@6.0.1` dépend de `tar ^7.5.10` et l'avis est corrigé en `>=7.5.19` — même majeure, le bump suffit. C'est ce qui amène le back à 0 critical. |
| Les migrations sont à rejouer sur une copie Postgres | Elles ne sont **jamais jouées** : pas de `.sequelizerc`, aucun script `db:migrate`, et le dossier a divergé des modèles. Le schéma vient du `sequelize.sync()` de [`back/index.js:24`](back/index.js:24). Voir § 2.3. |
| `axios.defaults.adapter` est le point d'attention du lot 5 | Sans objet : on est passé à `ofetch`, comme recommandé. Le vrai point d'attention était jest, qui résout la condition *browser* d'`ofetch` (ESM) — d'où le `moduleNameMapper` ajouté. |

---

## 4. Ce qui reste, par ordre de rentabilité

### 4.1 Remettre en place la veille — **le seul point structurel**

**Décision prise le 2026-09-13 : Renovate reste désactivé.** Ce qui suit reste
donc vrai et assumé — à relire le jour où cette passe sera à refaire.

Aujourd'hui :

- [`.github/dependabot.yml`](.github/dependabot.yml) est **entièrement commenté** ;
- [`.github/renovate.json`](.github/renovate.json) a `"enabled": false`.

Sans réactivation, cette passe sera à refaire dans dix-huit mois. Recommandation
inchangée : **Renovate seul** (pas les deux, ils se marchent dessus), avec
automerge des patches et des devDeps une fois la CI verte, et
`dependencyDashboardApproval` sur les majeures — c'est l'absence de ces deux
réglages qui avait conduit à tout désactiver. La configuration complète proposée
est dans l'historique : `git show aaa5a6e:DEPENDENCIES.md`, § 6.

Ajouter aussi un job CI non bloquant :

```yaml
  audit:
    <<: *common_properties
    steps:
      - run: cd back && yarn audit --level critical
      - run: cd front && yarn audit --level critical
```

`yarn audit` sort en code non nul dès qu'il trouve quelque chose au niveau
demandé. `--level critical` **passe au vert dès maintenant** sur les trois
périmètres : c'est donc un garde-fou qui tient, à poser tant qu'il tient.
Resserrer à `high` seulement après les § 4.3, 4.5, 4.6 et 4.7.

### 4.2 ~~`sqlite3`~~ — fait

Les 3 derniers `critical` du back étaient `tar` via `sqlite3@5.1.7`. Le plan
initial affirmait que `sqlite3@6.0.1` « ne supprime pas les 3 critical, il les
déplace au mieux » : **c'est faux**, vérifié sur le registre — `sqlite3@6.0.1`
dépend de `tar ^7.5.10`, et l'avis est corrigé en `>=7.5.19`, donc dans la même
majeure. Le bump suffit.

Côté front, l'unique `critical` restant était `tar@7.5.3` via
`nuxt > nitropack > @vercel/nft > @mapbox/node-pre-gyp`, dont la seule plage
demandée est `^7.4.0` : une `resolution` `tar: ^7.5.22` reste dans la majeure et
le règle.

`sqlite3@6` exige `node-gyp 12.x` en peer et se recompile nativement ; le
binding a été vérifié (sync + CRUD Sequelize sur SQLite).

### 4.3 `front` : montée Nuxt 4 [outillage + sécu]

Bloc **indivisible**, risque élevé, 3–5 j. Contraintes revérifiées :
`@pinia/nuxt@1` exige `pinia ^4.0.3` → `vue ^3.5.11` + `typescript >=5.6`, et
`vue-router@5` exige `vite ^7.3`. Cibles : `nuxt ^4.5.2`, `pinia ^4.0.3`,
`@pinia/nuxt ^1.0.2`, `vue-i18n ^11.4.10` (deux majeures), `typescript ^5.6`,
`mapbox-gl ^3.29` (CSS chargée en dur dans `nuxt.config.ts`, à remplacer ; noter
que mapbox-gl ≥2 est sous licence propriétaire, `maplibre-gl` est le fork libre).

Fait tomber les `high` `vite`, `rollup`, `svgo`, et le dernier `critical` `tar`
du front.

**À faire avant** : supprimer Vuex (§ 4.4), pour réduire le bruit pendant la montée.

### 4.4 `front` : supprimer Vuex [hygiène]

`vuex@^4.1.0` n'est plus utilisé que **dans les tests**, alors que le store de
production est Pinia (`front/stores/app.ts`). Il reste aussi un
`front/store/index.js` legacy. Migrer les specs vers `@pinia/testing`, supprimer
`front/store/`, retirer `vuex`.

### 4.5 `front` : Jest 29 → Vitest [outillage]

Bloqué par `@vue/vue3-jest@29.2.6`, qui déclare `peer jest: 29.x` en dernière
version publiée : **Jest 30 est inatteignable** sur le front tant qu'il est là.

Vitest supprime `jest`, `jest-environment-jsdom`, `babel-jest`, `@vue/vue3-jest`,
`jest-serializer-vue`, `pretty-format`, et probablement tout `babel.config.js` +
`@babel/*` du front. À traduire : `front/config/jest.config.json` (dont le
`moduleNameMapper` vers `ofetch`, qui **disparaît** — Vite résout l'ESM
nativement), les 5 mocks `front/config/jest.*.js`, et `test:front:ci`
(`--maxWorkers=25%` → `--pool=threads`).

Incohérence à corriger même si on reste sur Jest : `pretty-format` est en `^30.4`
alors que Jest est en 29.

### 4.6 ESLint 9/10 et Prettier 3 [outillage]

Bloqué par `eslint-config-airbnb-base@15`, qui déclare `peer eslint: ^7 || ^8`
et n'a pas de release flat-config. Il plafonne les **trois** projets à ESLint 8.

Piste recommandée : abandonner les règles de style au profit de Prettier seul.
Les règles de [`.eslintrc.js`](.eslintrc.js) racine sont à 80 % du formatage
(`comma-dangle`, `quotes`, `semi`, `padded-blocks`, …) que Prettier gère déjà.

**Piège vérifié pendant cette passe** : la config racine ne donne que des
*sévérités* (`'padded-blocks': 'error'`), pas des options. ESLint conserve alors
les options du config précédent de la chaîne `extends` — c'est-à-dire celles
d'`airbnb-base`. Un projet qui n'étend pas `airbnb-base` hérite donc des
sévérités avec les options **par défaut** d'ESLint, radicalement différentes.
C'était le cas de `tools/lighthouse` (corrigé dans `f025aff`). Toute réécriture
en flat config doit rendre ces options explicites.

Prettier 3 reformate tout le dépôt : commit de reformatage isolé, ajouté à
`.git-blame-ignore-revs`.

### 4.7 `back` : Babel 8 et outillage de test [outillage]

`@babel/cli`, `@babel/node`, `@babel/preset-env` sont figés en **7.14.x**
(mai 2021) alors que le front est en 7.28/7.29. Cibles : `@babel/* ^8`,
`mocha ^12`, `nyc ^18` (ou `c8`), `nodemon ^3.1`, `supertest ^7.2`,
`dotenv-extended ^3.1`, `dotenv ^17`.

C'est ce lot qui fait tomber les `braces` / `minimatch` restants du back
(`@babel/cli > chokidar`).

**Gelés volontairement** — le back compile en CommonJS via Babel :

| Paquet | Tenu en | Raison |
|--------|---------|--------|
| `chai` | `4.3.10` | `chai@5+` est ESM-only |
| `sinon-chai` | `3.7` | `v4` exige `chai ^5` |
| `sinon` | `11.1.0` | `sinon@22` est `type: module` (tester `^17` max) |
| `chalk` | `^4.1` | `chalk@5+` est ESM-only |
| `date-fns` | `2.30.0` | `v4` est `type: module` ; vérifier `require('date-fns/fp')` ([`date-utils.js:1`](back/src/domain/utils/date-utils.js:1)) |

Sortir de ces gels = basculer le back en ESM, ou remplacer Mocha+Chai+Sinon par
Vitest — cohérent avec le § 4.5, et à décider ensemble.

### 4.8 Renoncements assumés

| Renoncement | Raison |
|-------------|--------|
| **Express 5** | Aucun gain sécurité sur `4.22.2`. Casse `req.query` et la syntaxe `path-to-regexp@8`. |
| **Sequelize 7** | Pas de release stable sur le tag `latest`. `6.37.8` corrige tous les critical. |
| **`typescript` 7** | Le front n'a du TS que dans `nuxt.config.ts` et `stores/app.ts`. S'aligner sur le peer de `pinia@4` (`>=5.6`) suffit. |
| **Yarn 1 → Yarn 4** | `yarn@1.22` est en fin de vie et son `audit` est bruyant, mais migrer touche `engines`, les 3 lockfiles, CircleCI et le build Heroku. Chantier séparé. |
| **Node 22 → 24** | Node 22.22 satisfait toutes les cibles ci-dessus. Ne pas coupler deux sources de casse. |
| **`minimatch` / `js-yaml` / `picomatch`** | ~80 % du décompte `high` restant, ~0 % de risque exploitable : ils tournent au build, sur des globs et des YAML qui sont les nôtres. Leurs correctifs sont répartis sur des majeures incompatibles entre elles (`minimatch` 3.1.4 / 5.1.8 / 9.0.6 / 10.2.3, `js-yaml` 3 vs 4 qui supprime `safeLoad`), donc **pas de `resolution` possible**. Ils tomberont avec les § 4.3, 4.5, 4.6 et 4.7. |

---

## 5. Pièges rencontrés, à connaître avant de toucher aux dépendances

1. **Yarn 1 casse `strip-ansi@6`, dans les trois projets.** Yarn fusionne
   `"strip-ansi-cjs@npm:strip-ansi@^6.0.1"` (introduit par `@isaacs/cliui`, via
   `glob`) avec toute demande qui **résout à la même version**, en une seule
   entrée de lock portant le nom de l'alias. Résultat : aucun dossier
   `strip-ansi@6` n'est matérialisé, et ESLint 8 comme Jest tombent sur le
   `strip-ansi@7` (ESM-only) hissé à la racine →
   `TypeError: stripAnsi is not a function`, qui fait sortir `yarn lint` et
   `yarn test` en **code 2**, sans aucun rapport avec le code.

   Correctifs essayés qui **ne marchent pas** :
   - scinder l'entrée à la main dans `yarn.lock` : le `yarn install` suivant la
     refusionne ;
   - `"resolutions": { "strip-ansi": "^6.0.1" }` : la résolution est absorbée par
     l'entrée aliasée, et plus **aucun** `strip-ansi` n'est installé ;
   - `"strip-ansi": "6.0.1"` en dépendance directe : passe en yarn **1.22.19**,
     **échoue en 1.22.22** — celui de la CI — qui fusionne aussi les descripteurs
     exacts dès qu'ils résolvent à la même version.

   Ce qui marche, vérifié sous 1.22.19 **et** 1.22.22 :
   `"strip-ansi": "6.0.0"` en devDependency directe, **version exacte**. C'est la
   seule version 6.x qui ne collide avec rien : l'alias demande `^6.0.1` et
   résout 6.0.1, donc le descripteur `strip-ansi@6.0.0` reste une entrée
   distincte, et yarn place toujours une dépendance directe à la racine de
   `node_modules`. Les paquets qui veulent `^7` reçoivent une copie imbriquée.
   6.0.0 et 6.0.1 ne diffèrent que par la plage `ansi-regex` (`^5.0.0` vs
   `^5.0.1`), qui résout de toute façon 5.0.1.

   **Ne pas « nettoyer » ces trois lignes** en `^6.0.0`, `^6.0.1` ou `6.0.1` :
   le lint et les tests repasseraient rouge, y compris uniquement en CI. Elles
   disparaîtront avec Yarn 4, ou avec Vitest + ESLint flat config.

   **Conséquence pratique : après toute modification d'un `package.json`, faire
   un `rm -rf node_modules && yarn install` avant de conclure — et avec la même
   version de yarn que la CI (1.22.22).** Les installs incrémentaux, et les
   versions de yarn différentes, donnent des arbres différents.

2. **`front/.output/nitro.json` est versionné** alors que c'est un artefact de
   build : `yarn generate` le modifie à chaque fois. À `.gitignore`.

3. **Bugs préexistants repérés, non corrigés** (hors périmètre de cette passe) :
   - [`back/index.js:90`](back/index.js:90) : `debug(...)` est appelé comme un
     logger alors que `debug` est une *fabrique* — `debug('Listening on …')`
     crée un logger nommé et n'écrit rien. Devrait être
     `const log = debug('recontact:server')` puis `log(...)`.
   - [`back/src/infrastructure/seo/history.js`](back/src/infrastructure/seo/history.js) :
     la réécriture produit un double slash (`/articles/static/x.js` →
     `//static/x.js`), parce que le `to()` préfixe `/` à un chemin qui commence
     déjà par `/`. Comportement inchangé depuis la v1 du middleware.
   - `back/src/use_cases/database/db-service.js` lit `save/comments` au *chargement
     du module* : `yarn init:db` échoue si le dossier n'existe pas.
   - `front/services/services/api-service.*.spec.js` déclarent
     `expect.assertions(3)` pour une seule assertion réelle.


4. **`pg` doit rester dans `dependencies`** (cf. `777db94`). `sqlite3` et
   `sequelize-cli` sont dev/test only.

5. **`cimg/node:*-browsers` ne fournit plus Chrome préinstallé.** `chrome-launcher`
   sort en `ChromePathNotSetError`. Le job `lighthouse` installe donc Chrome avec
   l'orbe certifiée `circleci/browser-tools` et exporte `CHROME_PATH`.

6. **Les budgets `bundlesize` dataient de l'ère Nuxt 2.** Trois des six globs ne
   correspondaient plus à rien (`dist/articles/*/index.html` — les articles ne
   sont plus prérendus —, `_nuxt/fonts/`, `_nuxt/img/` — Nuxt 3 met tout à plat
   dans `_nuxt/`), et bundlesize échoue sur un glob sans correspondance. Les
   seuils ont été **rebasés sur la taille actuelle**, ils ne valent donc que
   comme garde-fou anti-régression à partir d'aujourd'hui. Le poste à regarder :
   `mapbox-gl` pèse **274 kB gzippés** à lui seul, sur un budget historique de
   56 kB pour *tout* le JS.

7. **Ne pas faire tourner Lighthouse sous Jest.** Sous
   `NODE_OPTIONS=--experimental-vm-modules`, le chargement dynamique des audits
   par Lighthouse casse le lieur de modules ESM de Jest —
   `request for './computed-artifact.js' is from a module not been linked` — et
   Jest ne rend jamais la main ensuite, ce qui a fait échouer le job sur
   « Too long with no output (exceeded 10m0s) » **après** que les tests soient
   terminés. `tools/lighthouse` utilise donc `node --test` : ESM natif, pas de
   VM modules, sortie propre, et jest en moins dans l'arbre de dépendances.

8. **Lighthouse 13 a ajouté une catégorie « Agentic Browsing ».** Elle score très
   bas (33 et 67 sur nos pages) et, comme le score global était une moyenne de
   *toutes* les catégories, elle l'a fait chuter de 86 à 70,4 sans qu'aucune page
   n'ait bougé. L'agrégat est désormais calculé sur les quatre catégories
   historiques (performance, accessibilité, bonnes pratiques, SEO), pour rester
   comparable dans le temps.

9. **Sequelize 6 écrase `dialectOptions` avec ce qu'il lit dans l'URL.**
   [`sequelize/lib/sequelize.js`](back/node_modules/sequelize/lib/sequelize.js)
   fait, pour le dialecte postgres :
   `Object.assign(options.dialectOptions, pgConnectionString.parse(uri))` —
   **après** avoir pris nos options. Toute clé `ssl` passée à côté de l'URI est
   donc jetée. Sequelize 5 ne faisait pas ça.

   Combiné au fait que, depuis **pg 8.16**, un `sslmode=require` nu signifie
   `verify-full` — et Heroku ajoute `?sslmode=require` à `DATABASE_URL`, et sert
   une chaîne de certificats auto-signée — le `rejectUnauthorized: false` du code
   devenait inopérant et l'application **crashait au démarrage** sur
   `SELF_SIGNED_CERT_IN_CHAIN`. Reproductible en une ligne :

   ```
   new Sequelize(url + '?sslmode=require', { dialectOptions: { ssl: { rejectUnauthorized: false } } })
     -> options.dialectOptions.ssl === {}
   ```

   Les réglages TLS doivent donc vivre **dans l'URL**, où `uselibpqcompat=true`
   rend à `require` son sens libpq : chiffrer sans vérifier la chaîne. C'est ce
   que fait `productionDatabaseUrl()` dans
   [`db-config.js`](back/src/infrastructure/db/db-config.js), sous test dans
   `test/infrastructure/db/db-config.spec.js`.

10. **Les scores Lighthouse varient trop pour servir de garde-fou fin.** Deux runs
   CI de la *même* page, à quelques minutes d'intervalle, bougent de **13 points
   en performance** et de **8 en SEO** :

   | Page | perf | a11y | bonnes pratiques | SEO |
   |------|-----:|-----:|-----------------:|----:|
   | Accueil | 74 – 87 | 93 – 94 | 96 – 100 | 83 – 91 |
   | Liste d'articles | 73 – 86 | 90 | 73 – 77 | 83 |
   | Article 85 | 37 | 96 | 77 | 100 |

   Les seuils du fichier sont donc **le minimum observé moins une marge**, pas un
   objectif : ils attrapent un effondrement, pas une régression. Les resserrer
   demande plus d'échantillons, ou une médiane sur plusieurs runs par page — au
   prix du temps de job. À noter : l'article 85 plafonne à **37 en performance**,
   c'est la page à regarder si le sujet revient.

---

## 6. Méthode, pour la prochaine fois

- Un lot = une modification de `package.json` + `yarn install` + commit du lock.
  On ne touche **jamais** `yarn.lock` à la main, sauf bug avéré de yarn (§ 5.1).
- Après chaque lot, sur chaque projet touché :
  `rm -rf node_modules && yarn install && yarn lint && yarn test && yarn build`.
- Archiver le `yarn audit --summary` dans la description de PR, pour tracer le
  delta plutôt que le total.
- Ne pas laisser le décompte brut dicter l'ordre : il compte des **chemins**, pas
  des paquets. Un paquet de build vulnérable sur des entrées qu'on écrit
  nous-mêmes ne vaut pas une injection SQL.
