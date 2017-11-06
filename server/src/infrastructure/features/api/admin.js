const express = require('express');
const UpdateArticle = require('../../../use_cases/update-article');

const router = express.Router();

router.patch('/articles/:id', (req, res) => UpdateArticle.sync(req.params.id)
  .then(() => res.sendStatus(204)));

module.exports = router;
