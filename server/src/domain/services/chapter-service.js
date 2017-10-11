const { Chapter } = require('../models');

function createChapters(chapters) {
  return Chapter
    .bulkCreate(chapters.chapters);
}

module.exports = {
  createChapters,
};
