# Dépendances : état après la passe sécurité, et suite

Ce fichier remplace le plan initial (commit `6adca85`). Le plan est exécuté pour
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
| `518d370` | 0   | `pg` déplacé en `dependencies` |
| `6f36c34` | 1   | paquets fantômes supprimés |
| `444b1ca` | 2   | `dropbox` 2→10, `node-mailjet` 3→6, sortie de `vm2` |
| `4a8548e` | 3   | `sequelize` 5.21.7 → 6.37.8 |
| `d36574e` | 4   | `express` 4.18.2 → 4.22.2 + middlewares |
| `aa9b925` | 5   | `axios` → `ofetch` sur le front |
| `8195073` | 10  | `tools/lighthouse` remis à niveau |
| `d343c2c` | §5  | `resolutions` transitives |
| *(celui-ci)* | §5 | `sqlite3` 5→6, `tar` épinglé, `strip-ansi` épinglé |

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
3. **Migrations Sequelize 6 sur une copie de la base Postgres de staging.**
   Le round-trip CRUD a été validé sur SQLite uniquement.
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
| Le lot 10 est un simple bump | `lighthouse ≥ 12` et `chrome-launcher ≥ 1` sont ESM-only : `tools/lighthouse` est passé en `"type": "module"`, jest tourne avec `--experimental-vm-modules`, et la catégorie **PWA a disparu de Lighthouse 12** (4 assertions supprimées). |
| `sqlite3@6` « ne supprime pas les 3 critical `tar` » | Faux : `sqlite3@6.0.1` dépend de `tar ^7.5.10` et l'avis est corrigé en `>=7.5.19` — même majeure, le bump suffit. C'est ce qui amène le back à 0 critical. |
| `axios.defaults.adapter` est le point d'attention du lot 5 | Sans objet : on est passé à `ofetch`, comme recommandé. Le vrai point d'attention était jest, qui résout la condition *browser* d'`ofetch` (ESM) — d'où le `moduleNameMapper` ajouté. |

---

## 4. Ce qui reste, par ordre de rentabilité

### 4.1 Remettre en place la veille — **le seul point structurel**

Non fait, et c'est la cause racine de la dérive. Aujourd'hui encore :

- [`.github/dependabot.yml`](.github/dependabot.yml) est **entièrement commenté** ;
- [`.github/renovate.json`](.github/renovate.json) a `"enabled": false`.

Sans réactivation, cette passe sera à refaire dans dix-huit mois. Recommandation
inchangée : **Renovate seul** (pas les deux, ils se marchent dessus), avec
automerge des patches et des devDeps une fois la CI verte, et
`dependencyDashboardApproval` sur les majeures — c'est l'absence de ces deux
réglages qui avait conduit à tout désactiver. La configuration complète proposée
est dans l'historique : `git show 6adca85:DEPENDENCIES.md`, § 6.

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
C'était le cas de `tools/lighthouse` (corrigé dans `8195073`). Toute réécriture
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
   `glob`) avec les demandes `strip-ansi@^6.x` en **une seule** entrée de lock,
   portant le nom de l'alias. Résultat : aucun dossier `strip-ansi@6` n'est
   jamais matérialisé, et ESLint 8 comme Jest tombent sur le `strip-ansi@7`
   (ESM-only) hissé à la racine → `TypeError: stripAnsi is not a function`, qui
   fait sortir `yarn lint` et `yarn test` en **code 2**, sans rapport avec le
   code.

   Que ça casse ou non dépendait de l'ordre de hissage, donc du dernier paquet
   installé : supprimer une dépendance sans aucun rapport suffisait à déclencher
   la panne.

   Deux correctifs ont été essayés et **ne marchent pas** :
   - scinder l'entrée à la main dans `yarn.lock` : le `yarn install` suivant la
     refusionne ;
   - `"resolutions": { "strip-ansi": "^6.0.1" }` : la résolution est absorbée par
     l'entrée aliasée, et plus **aucun** `strip-ansi` n'est installé.

   Ce qui marche : déclarer `"strip-ansi": "6.0.1"` en devDependency directe,
   **version exacte, sans `^`**. Le descripteur `strip-ansi@6.0.1` est distinct
   de `strip-ansi@^6.0.1`, il ne fusionne donc pas avec l'alias et yarn place
   bien le paquet à la racine. C'est en place dans `back/`, `front/` et
   `tools/lighthouse`. **Ne pas « nettoyer » ces trois lignes** en les passant en
   `^6.0.1` ou en les retirant : le lint et les tests repasseraient rouge de
   façon intermittente. Elles disparaîtront avec le passage à Yarn 4 ou à
   Vitest + ESLint flat config.

   **Conséquence pratique : après toute modification d'un `package.json`, faire
   un `rm -rf node_modules && yarn install` avant de conclure.** Les installs
   incrémentaux de yarn 1 donnent un arbre différent d'une install propre, et
   c'est l'install propre que fait la CI.

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
   - Les seuils de score de `tools/lighthouse` datent de Lighthouse 10 ; les
     courbes de notation ont bougé, ils seront à recalibrer au premier vrai run.

4. **`pg` doit rester dans `dependencies`** (cf. `518d370`). `sqlite3` et
   `sequelize-cli` sont dev/test only.

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
