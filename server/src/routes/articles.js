const express = require('express');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');

const router = express.Router();

router.get('/', (req, res) => {
  let metadatas;
  let articles;

  return DropboxClient.getAllFileMetaDataInDropbox()
    .then((receivedMetadatas) => {
      metadatas = receivedMetadatas;
      return metadatas;
    })
    .then(() => ArticlesSerializer.serialize(metadatas))
    .then((serializedArticles) => {
      articles = serializedArticles;
      return articles;
    })
    .then(() => DropboxClient.shareImages(articles)
      .then((articlesDropbox) => {
        console.log(articlesDropbox);
        return res.json(articlesDropbox);
      }));
});


module.exports = router;
