const articleRepository = require('../domain/repositories/article-repository')
const chapterRepository = require('../domain/repositories/chapter-repository')
const photoRepository = require('../domain/repositories/photo-repository')

function deleteAllArticles() {
  return Promise.all([
    articleRepository.deleteAll(),
    chapterRepository.deleteAll(),
    photoRepository.deleteAll(),
  ])
}

module.exports = {
  deleteAllArticles,
}
