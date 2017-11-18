export default {

  sortByDropboxId(articles) {
    return articles.sort((articleA, articleB) => {
      if (this.getDropboxId(articleA) < this.getDropboxId(articleB)) {
        return 1;
      }
      if (this.getDropboxId(articleA) > this.getDropboxId(articleB)) {
        return -1;
      }
      return 0;
    });
  },

  getDropboxId(article) {
    return parseInt(article.dropboxId, 10);
  },

};
