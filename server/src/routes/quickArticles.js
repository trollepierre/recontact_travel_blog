const express = require('express');
const articles = require('../../test/unit/fixtures/articlesWithSharedLink');

const router = express.Router();

router.get('/', (req, res) => res.json(articles));

module.exports = router;
