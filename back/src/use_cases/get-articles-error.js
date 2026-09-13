import GetArticlesMeta from './get-articles-meta'

const analyseArticleError = params => article => {
  const error = []
  if (params.images !== 'off' && article.brokenImgDropboxId.length !== 0) {
    error.push('missing images of chapter')
  }
  if (params.photos !== 'off' && article.photosCount === 0) {
    error.push('missing photos gallery')
  }
  if (article.chaptersCount === 0) {
    error.push('missing chapters')
  }
  return { ...article, error }
}

// see get-articles-meta: `.map` and `.filter` on a promise were bluebird's
async function getAll(params = {}) {
  const articles = await GetArticlesMeta.getAll()
  return articles
    .map(analyseArticleError(params))
    .filter(article => article.error.length !== 0)
}

export default {
  getAll,
}
