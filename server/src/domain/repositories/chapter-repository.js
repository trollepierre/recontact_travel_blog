const { Chapter } = require('../models/index')

function createArticleChapters(chapters) {
  return Chapter
    .bulkCreate(chapters)
}

function getChaptersOfArticle(dropboxId) {
  return Chapter.findAll({
    where: { dropboxId },
  })
}

function deleteChaptersOfArticle(dropboxId) {
  return Chapter.destroy({
    where: { dropboxId },
  })
}

function deleteAll() {
  return Chapter.destroy({ where: {} })
}

module.exports = {
  createArticleChapters,
  getChaptersOfArticle,
  deleteChaptersOfArticle,
  deleteAll,
}
