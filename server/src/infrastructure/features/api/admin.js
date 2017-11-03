const express = require('express');
const DeleteArticle = require('../../../use_cases/delete-article');

const router = express.Router();

router.get('/articles/:id/delete', (req, res) => DeleteArticle.deleteArticle(req.params.id)
  .then(() => res.sendStatus(204)));

module.exports = router;
