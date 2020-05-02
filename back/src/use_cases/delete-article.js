import articleRepository from '../domain/repositories/article-repository'

function deleteArticle(dropboxId) {
  return articleRepository.deleteByDropboxId(dropboxId)
}

export default {
  deleteArticle,
}
