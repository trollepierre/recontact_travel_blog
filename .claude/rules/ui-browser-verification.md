# Vérification UI — navigateur obligatoire

Vérifier un bug d'UI dans un vrai navigateur avant d'annoncer un correctif (surtout en mobile).

## Procédure de vérification

### 0. Prérequis

Les deux serveurs sont nécessaires : le front (3333) tape l'API sur `NUXT_ENV_API_URL`
(`http://localhost:3334` par défaut). Les configs sont déjà dans `.claude/launch.json` (elles
chargent Node 22.22.0 via nvm) :

- `preview_start` avec `name: "recontact-back"` → API sur 3334
- `preview_start` avec `name: "recontact-front"` → Nuxt dev server sur 3333

Vérifier la compilation avec `preview_logs` avant de conclure quoi que ce soit sur l'UI : un écran
vide est souvent une erreur de build, pas un bug de layout. Les lignes qui signalent que c'est prêt :

- back : `Listening on port: 3334` (précédé des `CREATE TABLE IF NOT EXISTS ...` sqlite)
- front : `➜ Local: http://localhost:3333/` puis `Nuxt Nitro server built`

Le front met ~20 s à répondre 200 au premier démarrage (pré-bundling Vite de `mapbox-gl`, `axios`) et
recharge une fois juste après (`optimized dependencies changed. reloading`) : attendre cette reload
avant de juger un rendu.

### 1. Ouvrir la page concernée

`navigate` sur `http://localhost:3333`, puis la route visée : `/` (homepage), `/articles` (liste),
`/articles/:id` (article), `/admin`. Pas de login : aucune route n'est protégée en local.

⚠️ `/admin` expose des boutons destructeurs (« SUPPRIMER TOUS LES ARTICLES », « SUPPRIMER & SYNCHRO »)
et un déclencheur de build Netlify. Ne jamais les cliquer pour « tester » — lire le DOM à la place.

### 2. Matcher le viewport

`resize_window` avec `width`/`height` explicites (ex. 390×844 pour un mobile `< 400px`), pas
seulement un `matchMedia` théorique. Recharger la page pour rejouer les gates au load, et
confirmer dans la page :

```js
({ innerWidth, mm640: matchMedia('(max-width: 640px)').matches })
```

Le breakpoint principal du projet est **640px** (`min-width: 640px` = desktop dans la plupart des
composants).

### 3. Rejouer le scénario exact

Cliquer le contrôle concerné avec `computer` — un snapshot DOM sans interaction ne suffit pas.
Si le panneau navigateur est masqué, `computer` échoue en timeout : soit `tabs_select` pour
l'afficher, soit piloter le clic via `javascript_tool`.

### 4. Compter / mesurer ce que l'utilisateur décrit

Pas « le panneau existe » mais « N éléments visibles **et** cliquables », via
`getBoundingClientRect` + `elementFromPoint` :

```js
const clickable = [...document.querySelectorAll('button, a')].filter(b => {
  const r = b.getBoundingClientRect()
  if (!r.width || !r.height || r.top < 0 || r.bottom > innerHeight) return false
  return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('button, a') === b
})
clickable.length
```

### 5. Si la capture utilisateur montre encore le bug

**La croire** et retirer le fix, plutôt que d'arguer que « ça marche chez moi » sans même viewport.

### 6. Nettoyer

`resize_window` avec `preset: "desktop"` pour rendre l'onglet à sa taille normale, et
`preview_stop` sur les serveurs qui ne servent plus.

## Pièges Recontact

- Nuxt fait du SSR/SSG : un écart serveur/client se voit dans la console (hydration mismatch) —
  toujours lire `read_console_messages` avant de conclure. **Il y en a déjà un au démarrage**, sur
  `<DefaultLayout>` (`Hydration node mismatch` + `Hydration completed but contains mismatches`) :
  c'est un bruit préexistant, pas la preuve que ton changement casse quelque chose. Comparer avec un
  `git stash`/état de base avant de l'attribuer à un fix.
- Les warnings `<Suspense> is an experimental feature` et les logs Nuxt DevTools sont eux aussi du
  bruit normal.
- La carte Mapbox (`front/components/Homepage/Map/Map.vue`) a besoin de `NUXT_PUBLIC_MAPBOX_TOKEN` ;
  il est fourni dans `front/.env.defaults`, donc la carte doit s'afficher — si elle est vide, c'est
  que `.env.local` a été modifié.
- La base locale démarre vide : `/api/articles` renvoie `[]`, les listes d'articles et la position de
  l'admin sont vides. Ce n'est pas un bug de CSS.
