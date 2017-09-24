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
      chapters[i - 1] = {
        title: [cuttedArticle[(3 * i) - 2], cuttedArticle[(3 * i) - 1]].join(' ').trim(),
        imgLink,
        text: this._addParagraphs(cuttedArticle[3 * i]),
      };
    }
    return chapters;
  },

  _addParagraphs(text) {
    return text.split('#').map(row => row.trim());
  },
};

module.exports = ChaptersSerializer;
