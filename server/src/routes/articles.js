const express = require('express');
const DropboxClient = require('../infrastructure/dropbox');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getFile()
  .then((file) => {
    const article = {
      imgLink: 'https://www.dropbox.com/s/fghmcj18maztdgv/img0.jpg?dl=1',
    };
    const article2 = {
      imgLink: file,
    };
    const articles = [article, article2];
    return res.json(articles);
  }));

module.exports = router;
