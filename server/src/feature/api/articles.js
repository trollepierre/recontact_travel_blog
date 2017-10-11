const express = require('express');
const File = require('../../infrastructure/file');
const DropboxClient = require('../../infrastructure/dropbox');
const ChaptersSerializer = require('../../serializers/chapters');
const ArticleService = require('../../domain/services/article-service');

const router = express.Router();

// TODO what if database is not synchronize?
router.get('/', (req, res) => ArticleService.getAll()
  .then(articles => res.json(articles)));

router.get('/:some_id', (req, res) => DropboxClient.getFileContentStream(req.params.some_id)
  .then(File.read)
  .then(chaptersContent => ChaptersSerializer.serialize(chaptersContent))
  .then(chapters => DropboxClient.shareChapterImages(chapters, req.params.some_id))
  .then(chapters => res.json(chapters)));

module.exports = router;
