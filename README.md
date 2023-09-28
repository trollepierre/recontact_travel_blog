# Recontact - Travel blog

[![CircleCI](https://circleci.com/gh/trollepierre/recontact_travel_blog/tree/master.svg?style=svg)](https://circleci.com/gh/trollepierre/recontact_travel_blog/tree/master)
[![Known Vulnerabilities](https://snyk.io/test/github/trollepierre/recontact_travel_blog/badge.svg)](https://snyk.io/test/github/trollepierre/recontact_travel_blog)
[![Netlify Status EN](https://api.netlify.com/api/v1/badges/56d6576e-c95a-41b4-999f-9e0bab48d768/deploy-status)](https://app.netlify.com/sites/en-recontact/deploys)
[![Netlify Status FR](https://api.netlify.com/api/v1/badges/cbcec67a-0c04-46cb-b5d0-5a165183c6e6/deploy-status)](https://app.netlify.com/sites/fr-recontact/deploys)
[![](https://img.shields.io/badge/License-MIT-green.svg?logo=internetarchive&logoColor=white&labelColor=464646&style=for-the-badge)](LICENSE.md)
[![](https://img.shields.io/github/commit-activity/m/trollepierre/recontact_travel_blog?label=Commits&logo=github&logoColor=white&labelColor=464646&style=for-the-badge)](https://github.com/trollepierre/recontact_travel_blog/commits/master)
[![](https://img.shields.io/codefactor/grade/github/trollepierre/recontact_travel_blog?label=Code+Quality&logo=codefactor&logoColor=white&labelColor=464646&color=29c3c5&style=for-the-badge)](https://www.codefactor.io/repository/github/trollepierre/recontact_travel_blog)


## Getting started

The recommended Node version matching production is available in [.nvmrc](https://github.com/trollepierre/recontact_travel_blog/blob/dev/.nvmrc).

``` bash
# install Yarn
npm install -g yarn@latest

# get project sources
git clone git@github.com:trollepierre/recontact_travel_blog.git
cd recontact_travel_blog

# install dependencies
yarn

# run tests
yarn test

# build Vue.js  client for production with minification
yarn build

# start the application (run in two terminals)
yarn start:back
yarn start:front
```

You can run the API server independently of the client's development one.

## Push and Skip CI

Skipping pipeline is possible by passing either [ci skip] or [skip ci] tag in the first line of the body of the commit or the commit’s title as documented in [CircleCI docs](https://circleci.com/docs/2.0/skip-build/).

## Release to production

The release to production process is as simple as running the command (from any branch):

```bash
yarn release
```

## PostgreSQL

SQLite is recommended for local development. To fix bug in production, it is better to use PostgreSQL

https://www.postgresql.org/download/
