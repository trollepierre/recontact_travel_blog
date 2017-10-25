const { Chapter } = require('../models/index');

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
