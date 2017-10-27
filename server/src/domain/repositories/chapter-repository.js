const { Chapter } = require('../../infrastructure/db/index');

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
