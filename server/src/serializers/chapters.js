const ChaptersSerializer = {

  serialize(rawArticle) {
    const cuttedArticle = rawArticle
      .split('*')
      .map(row => row.trim());

    const chapters = this._generateChapters(cuttedArticle);

    return {
      title: cuttedArticle[0],
      chapters,
    };
  },

  _generateChapters(cuttedArticle) {
    const chapters = [];
    for (let i = 1; i < cuttedArticle.length / 3; i += 1) {
      const imgLink = `img${i}.jpg`;
      const title = cuttedArticle[(3 * i) - 2];
      const subtitle = cuttedArticle[(3 * i) - 1];
      chapters[i - 1] = {
        title: [title, subtitle].join(' ').trim(),
        imgLink,
        // TODO : add Paragraph from data in db -  text: this._addParagraphs(cuttedArticle[3 * i]),
        text: cuttedArticle[3 * i],
      };
    }
    return chapters;
  },

  // TODO remove it
  _addParagraphs(text) {
    return text.split('#').map(row => row.trim());
  },

  // TODO remove it
  addParagraphs(chapters) {
    return chapters.map(chapter => Object.assign(chapter, { text: this._addParagraphs(chapter.text) }));
  },
};

module.exports = ChaptersSerializer;
