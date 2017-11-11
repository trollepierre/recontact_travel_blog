const { sinon, expect } = require('../../test-helper');
const articleRepository = require('../../../src/domain/repositories/article-repository');
const { Article } = require('../../../src/domain/models/index');
const articleSaved = require('../../fixtures/articleSaved');
const articleToSave = require('../../fixtures/articleToSave');

describe('Unit | Repository | article-repository', () => {
  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Article, 'bulkCreate');
    });

    afterEach(() => {
      Article.bulkCreate.restore();
    });

    it('should call Sequelize Model#bulkCreate', () => {
      // given
      const articlesToSave = [articleToSave(), articleToSave()];
      const savedArticles = [articleSaved(), articleSaved()];
      Article.bulkCreate.resolves(savedArticles);

      // when
      const promise = articleRepository.create(articlesToSave);

      // then
      return promise.then((res) => {
        expect(Article.bulkCreate).to.have.been.called;
        expect(res).to.deep.equal(savedArticles);
      });
    });
  });

  describe('#getAll', () => {
    beforeEach(() => {
      sinon.stub(Article, 'all').resolves();
    });

    afterEach(() => {
      Article.all.restore();
    });

    it('should call Sequelize Model#all', () => {
      // when
      const promise = articleRepository.getAll();

      // then
      return promise.then(() => {
        expect(Article.all).to.have.been.called;
      });
    });
  });

  describe('#updateName', () => {
    const dropboxId = 47;

    beforeEach(() => {
      sinon.stub(Article, 'update').resolves();
    });

    afterEach(() => {
      Article.update.restore();
    });

    it('should call Sequelize Model#update', () => {
      // when
      const promise = articleRepository.updateName('title', dropboxId);

      // then
      return promise.then(() => {
        expect(Article.update).to.have.been.calledWith({ name: 'title' }, { where: { dropboxId } });
      });
    });
  });

  describe('#deleteArticle', () => {
    const dropboxId = 47;

    beforeEach(() => {
      sinon.stub(Article, 'destroy').resolves();
    });

    afterEach(() => {
      Article.destroy.restore();
    });

    it('should call Sequelize Model#destroy', () => {
      // when
      const promise = articleRepository.deleteArticle(dropboxId);

      // then
      return promise.then(() => {
        expect(Article.destroy).to.have.been.calledWith({ where: { dropboxId } });
      });
    });
  });
});
