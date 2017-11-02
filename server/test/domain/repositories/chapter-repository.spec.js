const { sinon, expect } = require('../../test-helper');
const chapterRepository = require('../../../src/domain/repositories/chapter-repository');
const { Chapter } = require('../../../src/domain/models/index');
const chapterOfArticleSaved = require('../../fixtures/chapterOfArticleSaved');
const chapterOfArticleToSave = require('../../fixtures/chapterOfArticleToSave');

describe('Unit | Repository | chapter-repository', () => {
  let chaptersOfArticleToSave;
  let savedChaptersOfArticle;

  beforeEach(() => {
    chaptersOfArticleToSave = [chapterOfArticleToSave(), chapterOfArticleToSave()];
    savedChaptersOfArticle = [chapterOfArticleSaved(), chapterOfArticleSaved()];
  });

  describe('#createArticleChapters', () => {
    beforeEach(() => {
      sinon.stub(Chapter, 'bulkCreate');
    });

    afterEach(() => {
      Chapter.bulkCreate.restore();
    });

    it('should call Sequelize Model#bulkCreate', () => {
      // given
      Chapter.bulkCreate.resolves(savedChaptersOfArticle);

      // when
      const promise = chapterRepository.createArticleChapters(chaptersOfArticleToSave);

      // then
      return promise.then((res) => {
        expect(Chapter.bulkCreate).to.have.been.called;
        expect(res).to.deep.equal(savedChaptersOfArticle);
      });
    });
  });

  describe('#getChaptersOfArticle', () => {
    const dropboxId = 47;

    beforeEach(() => {
      sinon.stub(Chapter, 'findAll').resolves(savedChaptersOfArticle);
    });

    afterEach(() => {
      Chapter.findAll.restore();
    });

    it('should call Sequelize Model#all', () => {
      // when
      const promise = chapterRepository.getChaptersOfArticle(dropboxId);

      // then
      return promise.then((res) => {
        expect(Chapter.findAll).to.have.been.calledWith({ where: { dropboxId } });
        expect(res).to.deep.equal(savedChaptersOfArticle);
      });
    });
  });

  describe('#deleteChaptersOfArticle', () => {
    const dropboxId = 47;

    beforeEach(() => {
      sinon.stub(Chapter, 'destroy').resolves();
    });

    afterEach(() => {
      Chapter.destroy.restore();
    });

    it('should call Sequelize Model#destroy', () => {
      // when
      const promise = chapterRepository.deleteChaptersOfArticle(dropboxId);

      // then
      return promise.then(() => {
        expect(Chapter.destroy).to.have.been.calledWith({ where: { dropboxId } });
      });
    });
  });
});

