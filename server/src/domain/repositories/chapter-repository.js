const { Chapter } = require('../models/index');

function createArticleChapters(chapters) {
  return Chapter
    .bulkCreate(chapters);
}

function getChaptersOfArticle(dropboxId) {
  return Chapter.findAll({
    where: { dropboxId },
  });
}

module.exports = {
  createArticleChapters,
  getChaptersOfArticle,
};
