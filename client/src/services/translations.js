export default {

  getNavigatorLanguage() {
    return navigator.language
  },

  isFrancophone() {
    return this.getNavigatorLanguage().substring(0, 2) === 'fr'
  },

  getTitle(article) {
    const title = this.isFrancophone() ? article.frTitle : article.enTitle
    if (!title) return article.dropboxId
    return title
  },

  getChapterTitle(chapter) {
    return this.isFrancophone() ? chapter.frTitle : chapter.enTitle
  },

  getChapterText(chapter) {
    return this.isFrancophone() ? chapter.frText : chapter.enText
  },
}
