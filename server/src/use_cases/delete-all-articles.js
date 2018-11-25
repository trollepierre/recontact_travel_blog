import articleRepository from '../domain/repositories/article-repository'
import chapterRepository from '../domain/repositories/chapter-repository'
import photoRepository from '../domain/repositories/photo-repository'

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
