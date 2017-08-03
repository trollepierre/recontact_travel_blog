const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const article = {
    imgLink: 'https://www.dropbox.com/s/fghmcj18maztdgv/img0.jpg?dl=1',
  };
  const articles = [article];
  res.json(articles);
});

module.exports = router;
