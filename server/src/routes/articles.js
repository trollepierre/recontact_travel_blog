const express = require('express');
const DropboxFile = require('../infrastructure/dropbox-file');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');
const ParagraphsSerializer = require('../serializers/paragraphs');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getAllFileMetaDataInDropbox()
  .then(ArticlesSerializer.serialize)
  .then(articles => DropboxClient.shareImages(articles))
  .then(articlesDropbox => res.json(articlesDropbox)));

router.get('/:some_id', (req, res) => {
  return DropboxClient.getFileContentStream(req.params.some_id)
    .then(stream => DropboxFile.read(stream))
    .then(paragraphContent => ParagraphsSerializer.serialize(paragraphContent))
    .then(paragraphs => res.json(paragraphs));
});

module.exports = router;
