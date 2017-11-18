const express = require('express');
const GetAllArticles = require('../../../use_cases/get-all-articles');
const GetArticle = require('../../../use_cases/get-article');
const GetPhotosOfArticle = require('../../../use_cases/get-photos-of-article');

const router = express.Router();

router.get('/', (req, res) => GetAllArticles.getAllArticles()
  .then(articles => res.json(articles)));

router.get('/:id', (req, res) => GetArticle.getArticle(req.params.id)
  .then(chapters => res.json(chapters)));

router.get('/:id/photos', (req, res) => GetPhotosOfArticle.getAllPhotos(req.params.id)
  .then(photos => res.json(photos)));

module.exports = router;
