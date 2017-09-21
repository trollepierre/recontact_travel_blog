const ParagraphsSerializer = {

  serialize(rawArticle) {
    const cuttedArticle = rawArticle
      .split('*')
      .map(row => row.trim());

    const paragraphs = this._generateParagraphs(cuttedArticle);

    return {
      title: cuttedArticle[0],
      paragraphs,
    };
  },

  _generateParagraphs(cuttedArticle) {
    const paragraphs = [];
    for (let i = 1; i < cuttedArticle.length / 3; i += 1) {
      const imgLink = `img${i}.jpg`;
      paragraphs[i - 1] = {
        title: [cuttedArticle[(3 * i) - 2], cuttedArticle[(3 * i) - 1]].join(' '),
        imgLink,
        text: this._addParagraphs(cuttedArticle[3 * i]),
      };
    }
    return paragraphs;
  },

  _addParagraphs(text) {
    const formattedText = text.split('#').map(row => row.trim()).join('</p><p>');
    return `<p>${formattedText}</p>`;
  },
};

module.exports = ParagraphsSerializer;
