const { Chapter } = require('../models');

function createArticleChapters(chapters) {
  return Chapter
    .bulkCreate(chapters[0]);
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
