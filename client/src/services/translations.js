export default {

  getNavigatorLanguage() {
    return navigator.language;
  },

  getTitle(article) {
    const title = this.getNavigatorLanguage() === 'fr' ? article.frTitle : article.enTitle;
    if (!title) return article.dropboxId;
    return title;
  },

  getChapterTitle(chapter) {
    return this.getNavigatorLanguage() === 'fr' ? chapter.frTitle : chapter.enTitle;
  },

  getChapterText(chapter) {
    return this.getNavigatorLanguage() === 'fr' ? chapter.frText : chapter.enText;
  },
};
