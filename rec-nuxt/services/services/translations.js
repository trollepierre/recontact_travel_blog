export default {
  isFrancophone(language) {
    return language === 'fr'
  },

  getTitle(article, language) {
    const title = this.isFrancophone(language) ? article.frTitle : article.enTitle
    if (!title) {
      return article.dropboxId
    }
    return title
  },

  getChapterTitle(chapter, language) {
    return this.isFrancophone(language) ? chapter.frTitle : chapter.enTitle
  },

  getChapterText(chapter, language) {
    return this.isFrancophone(language) ? chapter.frText : chapter.enText
  },
}
