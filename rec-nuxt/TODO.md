CAN USE NUXT IN PROD
-
- [x] yarn start work
- [x] work in production with /articles/85 reload
- [x] remove broken nav bars
- [x] validate if nuxt is needed
- [x] fix language
 
- [x] remove console log in prod
- [x] check comment and photos

CRITIC
-
- [ ] add sitemap and robots.txt
- [x] add english


BUG TO FIX ASAP
-
- [x] manage a way not to push on master every time
- [ ] add https://nuxtjs.org/api/pages-head
- [ ] add test
- [ ] toaster à remove
- [ ] api Service à utiliser partout
- [ ] fix env variable for api url
- [ ] fix  ERROR  Error generating /articles/:id 
- [ ] clean everything
- [ ] manage language in nuxt.config.js
- [ ] fix warn during install
- [ ] fix e2e
- [ ] fix modal => showNavBar
- [ ] fix notif
- [ ] fix analytics
- [ ] manage 404

Todo Later : 
-
- [ ] add https://www.netlify.com/docs/redirects/
- [ ] https://app.netlify.com/sites/frosty-rosalind-02ec4f/settings/general#deploy-status-badge
- [ ] https://app.netlify.com/sites/frosty-rosalind-02ec4f/settings/deploys#post-processing

Less critic
-
- [ ] FETCH : env variables to make work with heroku and netlify
- [ ] /admin cassé => heroku front en back-office OU BIEN créer un lien vers l'admin
- [ ] vérifier et nettoyer les sites sur netlify zone dns
- [ ] rec.me : attention les env de branches et dev sont sur l'api de prod
- [ ] clean mongodb on recontact branch


WITHOUT INTERNET
-
- [ ] fix test
- [ ] validate articles/:id (for example dropboxId= 99) 404
- [ ] i18n plugin bizarre
- [ ] window.js => window = {}

REC.ME BUG
-
- GET  /api/articles/46/photos 304 8.559 ms - -
Unhandled rejection TypeError: Cannot read property 'frTitle' of null
