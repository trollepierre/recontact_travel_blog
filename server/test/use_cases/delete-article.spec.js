const { expect, sinon } = require('../test-helper');
const DeleteArticle = require('../../src/use_cases/delete-article');
const ChapterRepository = require('../../src/domain/repositories/chapter-repository');

describe('Unit | DeleteArticle | deleteChapters', () => {
  const dropboxId = 8;

  beforeEach(() => {
    sinon.stub(ChapterRepository, 'deleteChaptersOfArticle').resolves();
  });

  afterEach(() => {
    ChapterRepository.deleteChaptersOfArticle.restore();
  });

  it('should call ChapterRepository to deleteChaptersOfArticle articles', () => {
    // when
    DeleteArticle.deleteArticle(dropboxId);

    // then
    expect(ChapterRepository.deleteChaptersOfArticle).to.have.been.calledWith(dropboxId);
  });
});

