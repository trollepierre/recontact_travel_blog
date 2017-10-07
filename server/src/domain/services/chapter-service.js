const { Chapter } = require('../models');

function addChapter(title, imgLink, text) {
  return Chapter
    .findOrCreate({ where: { title, imgLink, text } })
    .spread((chapter, created) => ({ chapter, created }));
}

function removeChapter(chapterId) {
  return Chapter.destroy({ where: { id: chapterId } });
}

module.exports = {
  addChapter,
  removeChapter,
};
