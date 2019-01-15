import { Chapter } from '../models/index'

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

export default {
  createArticleChapters,
  getChaptersOfArticle,
  deleteChaptersOfArticle,
  deleteAll,
}
