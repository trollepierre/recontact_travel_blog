const express = require('express');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getAllFileMetaDataInDropbox()
  .then(ArticlesSerializer.serialize)
  .then(articles => DropboxClient.shareImages(articles))
  .then(articlesDropbox => res.json(articlesDropbox)));

module.exports = router;
