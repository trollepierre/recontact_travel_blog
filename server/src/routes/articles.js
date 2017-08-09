const express = require('express');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');

const router = express.Router();

router.get('/', (req, res) => {
  let metadatas;

  DropboxClient.getAllFileMetaDataInDropbox()
    .then((receivedMetadatas) => {
      metadatas = receivedMetadatas;
      console.log(metadatas);

      return metadatas;
    })
    .then(() => ArticlesSerializer.serialize(metadatas))
    .then(articles => res.json(articles));
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
