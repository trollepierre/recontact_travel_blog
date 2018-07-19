export default {

  getNavigatorLanguage() {
    return navigator.language
  },

  getTitle(article) {
    const title = this.getNavigatorLanguage().substring(0, 2) === 'fr' ? article.frTitle : article.enTitle
    if (!title) return article.dropboxId
    return title
  },

  getChapterTitle(chapter) {
    return this.getNavigatorLanguage().substring(0, 2) === 'fr' ? chapter.frTitle : chapter.enTitle
  },

  getChapterText(chapter) {
    return this.getNavigatorLanguage().substring(0, 2) === 'fr' ? chapter.frText : chapter.enText
  },
}
