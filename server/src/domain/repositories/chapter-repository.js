import { Newchapter } from '../models/index'
import { sortByAscendingNumber } from '../utils/ramda-utils'

function createArticleChapters(chapters) {
  return Newchapter
    .bulkCreate(chapters)
}

function getChaptersOfArticle(dropboxId) {
  return Newchapter.findAll({
    where: { dropboxId },
  })
    .then(chapters => sortByAscendingNumber(chapters, 'position'))
}

function deleteChaptersOfArticle(dropboxId) {
  return Newchapter.destroy({
    where: { dropboxId },
  })
}

function deleteAll() {
  return Newchapter.destroy({ where: {} })
}

export default {
  createArticleChapters,
  getChaptersOfArticle,
  deleteChaptersOfArticle,
  deleteAll,
}
