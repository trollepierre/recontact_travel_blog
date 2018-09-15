# Recontact - Travel blog

## Getting started

```bash
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
