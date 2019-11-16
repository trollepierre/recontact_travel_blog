# Recontact - Travel blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/56d6576e-c95a-41b4-999f-9e0bab48d768/deploy-status)](https://app.netlify.com/sites/inspiring-bardeen-ca64f5/deploys)
[![CircleCI](https://circleci.com/gh/trollepierre/recontact_travel_blog/tree/master.svg?style=svg)](https://circleci.com/gh/trollepierre/recontact_travel_blog/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/trollepierre/recontact_travel_blog/badge.svg)](https://coveralls.io/github/trollepierre/recontact_travel_blog)
[![Maintainability](https://api.codeclimate.com/v1/badges/5f37552833dea8b9ae48/maintainability)](https://codeclimate.com/github/trollepierre/recontact_travel_blog/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/trollepierre/recontact_travel_blog/badge.svg)](https://snyk.io/test/github/trollepierre/recontact_travel_blog)

## Getting started


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

You can run the API server independently from the client's development one.

## Release to production

The release to production process is as simple as running the command (from any branch):

```bash
yarn release
```

## PostgreSQL

SQLite is recommended for local development. To fix bug in production, it is better to use PostgreSQL
https://www.postgresql.org/download/
