const express = require('express');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');

const router = express.Router();

router.get('/', (req, res) => {
  let metadatas;
  let articles;

  // DropboxClient.shareImg()
  DropboxClient.getAllFileMetaDataInDropbox()
    .then((receivedMetadatas) => {
      metadatas = receivedMetadatas;
      return metadatas;
    })
    .then(() => ArticlesSerializer.serialize(metadatas))
    .then((serializedArticles) => {
      articles = serializedArticles;
      return articles;
    })
    .then(() => {
      const perfectArticles = DropboxClient.shareImages(articles);
      console.log('perfectArticles');
      console.log(perfectArticles);
      return res.json(perfectArticles);
    });
  // const article = {
  //   imgLink: 'https://www.dropbox.com/s/fghmcj18maztdgv/img0.jpg?dl=1',
  // };
  // const article2 = {
  //   imgLink: metadatas,
  // };
  // const articles = [article, article2];
  // return res.json(articles);
// });
});


module.exports = router;
