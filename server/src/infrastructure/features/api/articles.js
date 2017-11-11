const express = require('express');
const GetAllArticles = require('../../../use_cases/get-all-articles');
const GetArticle = require('../../../use_cases/get-article');

const router = express.Router();

router.get('/', (req, res) => GetAllArticles.getAllArticles()
  .then(articles => res.json(articles)));

router.get('/:id', (req, res) => GetArticle.getArticle(req.params.id)
  .then(chapters => res.json(chapters)));

module.exports = router;
