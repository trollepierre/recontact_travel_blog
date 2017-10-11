const { Chapter } = require('../models');

function createArticleChapters(chapters, article) {
  chapters.chapters.map(chapter => Object.assign(chapter, { dropboxId: article.dropboxId }));
  return Chapter
    .bulkCreate(chapters.chapters);
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
