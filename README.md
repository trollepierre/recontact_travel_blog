# Recontact - Travel blog

[![Coverage Status](https://coveralls.io/repos/github/trollepierre/recontact_travel_blog/badge.svg)](https://coveralls.io/github/trollepierre/recontact_travel_blog)

## Getting started

```bash
# get project sources
git clone git@github.com:trollepierre/recontact_travel_blog.git
cd recontact_travel_blog

# install dependencies
npm install

# run tests
npm test

# build Vue.js  client for production with minification
npm run build

# start the application
npm start
```

You can run the API server independently from the client's development one.

## Server

```bash
cd server
npm start
```

## Client

```bash
cd client
npm start
```

## Release to production (not working yet)

The release to production process is as simple as running the command (from any branch):

```bash
npm run release
```

## PostgreSQL

Il est nécessaire d'installer une base PostGreSQL pour être isoProd (sinon prenez MySQLite).
https://www.postgresql.org/download/
