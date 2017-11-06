const { expect, sinon } = require('../test-helper');
const UpdateArticle = require('../../src/use_cases/update-article');
const ChapterRepository = require('../../src/domain/repositories/chapter-repository');
const ArticleRepository = require('../../src/domain/repositories/article-repository');

describe('Unit | UpdateArticle | sync', () => {
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
    UpdateArticle.sync(dropboxId);

    // then
    expect(ChapterRepository.deleteChaptersOfArticle).to.have.been.calledWith(dropboxId);
  });

  it('should call ArticleRepository to delete the article', () => {
    // when
    UpdateArticle.sync(dropboxId);

    // then
    expect(ArticleRepository.deleteArticle).to.have.been.calledWith(dropboxId);
  });
});

