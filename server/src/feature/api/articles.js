const express = require('express');
const ChaptersSerializer = require('../../serializers/chapters');
const ArticleService = require('../../domain/services/article-service');
const ChapterService = require('../../domain/services/chapter-service');

const router = express.Router();

// TODO what if database is not synchronize?
router.get('/', (req, res) => ArticleService.getAll()
  .then(articles => res.json(articles)));

router.get('/:some_id', (req, res) => ChapterService.getChaptersOfArticle(req.params.some_id)
  .then(chapters => ChaptersSerializer.addParagraphs(chapters))
  .then(chapters => res.json(chapters)));

module.exports = router;
