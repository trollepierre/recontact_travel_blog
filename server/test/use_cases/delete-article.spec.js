const { expect, sinon } = require('../test-helper');
const DeleteArticle = require('../../src/use_cases/delete-article');
const ChapterRepository = require('../../src/domain/repositories/chapter-repository');
const ArticleRepository = require('../../src/domain/repositories/article-repository');

describe('Unit | DeleteArticle | deleteArticle', () => {
  const dropboxId = 8;

  beforeEach(() => {
    sinon.stub(ChapterRepository, 'deleteChaptersOfArticle').resolves();
    sinon.stub(ArticleRepository, 'deleteArticle').resolves();
  });

  afterEach(() => {
    ChapterRepository.deleteChaptersOfArticle.restore();
    ArticleRepository.deleteArticle.restore();
  });

  it('should call ChapterRepository to delete the Chapters Of the Article', () => {
    // when
    DeleteArticle.deleteArticle(dropboxId);

    // then
    expect(ChapterRepository.deleteChaptersOfArticle).to.have.been.calledWith(dropboxId);
  });

  it('should call ArticleRepository to delete the article', () => {
    // when
    DeleteArticle.deleteArticle(dropboxId);

    // then
    expect(ArticleRepository.deleteArticle).to.have.been.calledWith(dropboxId);
  });
});

