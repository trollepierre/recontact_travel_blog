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

function deleteChaptersOfArticle(dropboxId) {
  return Chapter.destroy({
    where: { dropboxId },
  });
}

module.exports = {
  createArticleChapters,
  getChaptersOfArticle,
  deleteChaptersOfArticle,
};
