const express = require('express');
const DropboxFile = require('../infrastructure/dropbox-file');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');
const ParagraphsSerializer = require('../serializers/paragraphs');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getAllFileMetaDataInDropbox()
  .then(ArticlesSerializer.serialize)
  .then(DropboxClient.shareImages)
  .then(res.json));

router.get('/:some_id', (req, res) => {
  return DropboxClient.getFileContentStream(req.params.some_id)
    .then(DropboxFile.read)
    .then(ParagraphsSerializer.serialize)
    .then(res.json);
});

module.exports = router;
