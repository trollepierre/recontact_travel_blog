const express = require('express');
// const DropboxClient = require('../infrastructure/dropbox');
// const ArticlesSerializer = require('../serializers/articles');

const router = express.Router();

// router.get('/', (req, res) =>
router.get('/', () =>
  [{
    name: '58',
    imgLink: 'https://www.dropbox.com/s/32mke07u3aluat4/img0.jpg?dl=1',
  },
  {
    name: '59',
    imgLink: 'https://www.dropbox.com/s/tk2qzdf6u1brv6o/img0.jpg?dl=1',
  },
  {
    name: '47',
    imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
  },
  {
    name: '57',
    imgLink: 'https://www.dropbox.com/s/a9jk0lgrwqx6g24/img0.jpg?dl=1',
  },
  {
    name: '60',
    imgLink: 'https://www.dropbox.com/s/bymurv4vlj1zohg/img0.jpg?dl=1',
  },
  {
    name: '61',
    imgLink: 'https://www.dropbox.com/s/dlwb3dq928fxhvy/img0.jpg?dl=1',
  },
  {
    name: '62',
    imgLink: 'https://www.dropbox.com/s/8qvztztaygnukuo/img0.jpg?dl=1',
  },
  {
    name: '69',
    imgLink: 'https://www.dropbox.com/s/p6k9hesxte11wcf/img0.jpg?dl=1',
  },
  ]);

// DropboxClient.getAllFileMetaDataInDropbox()
// .then(ArticlesSerializer.serialize)
// .then(articles => DropboxClient.shareImages(articles))
// .then(articlesDropbox => {
//   console.log(articlesDropbox);
//
//
//   return res.json(articlesDropbox);
// }));

module.exports = router;
