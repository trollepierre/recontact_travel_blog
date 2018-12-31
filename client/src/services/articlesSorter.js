const getDropboxId = article => parseInt(article.dropboxId, 10)

export default {
  sortByDropboxId(articles) {
    return articles.sort((articleA, articleB) => {
      if (getDropboxId(articleA) < getDropboxId(articleB)) {
        return 1
      }
      if (getDropboxId(articleA) > getDropboxId(articleB)) {
        return -1
      }
      return 0
    })
  },
}
