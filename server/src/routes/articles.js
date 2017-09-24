const express = require('express');
const File = require('../infrastructure/file');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');
const ChaptersSerializer = require('../serializers/chapters');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getAllFileMetaDataInDropbox()
  .then(ArticlesSerializer.serialize)
  .then(articles => DropboxClient.shareImages(articles))
  .then(articlesDropbox => res.json(articlesDropbox)));

router.get('/:some_id', (req, res) => DropboxClient.getFileContentStream(req.params.some_id)
  .then(File.read)
  .then(chapterContent => ChaptersSerializer.serialize(chapterContent))
  .then(chapters => DropboxClient.shareChapterImages(chapters, req.params.some_id))
  .then(chapters => res.json(chapters)));

module.exports = router;
