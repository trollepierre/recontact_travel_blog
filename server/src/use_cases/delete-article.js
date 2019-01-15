import articleRepository from '../domain/repositories/article-repository'

function deleteArticle(id) {
  return articleRepository.deleteArticle(id)
}

export default {
  deleteArticle,
}
