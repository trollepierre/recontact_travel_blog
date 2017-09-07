const ParagraphsSerializer = {

  serialize(rawArticle) {
    console.log('welcome in paragraph serializer');

    const cuttedArticle = rawArticle
      .split('*')
      .map(row => row.trim());

    const paragraphs = [];
    for (let i = 1; i < cuttedArticle.length / 3; i += 1) {
      paragraphs[i - 1] = {
        title: [cuttedArticle[(3 * i) - 2], cuttedArticle[(3 * i) - 1]].join(' '),
        imgLink: `img${i}.jpg`,
        text: this._addParagraphs(cuttedArticle[3 * i]),
      };
    }
    return {
      title: cuttedArticle[0],
      paragraphs,
    };
  },

  _addParagraphs(text) {
    const formattedText = text.split('#').map(row => row.trim()).join('</p><p>');
    return `<p>${formattedText}</p>`;
  },
};

module.exports = ParagraphsSerializer;
