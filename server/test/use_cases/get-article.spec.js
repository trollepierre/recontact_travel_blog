const { expect, sinon } = require('../test-helper');
const GetArticle = require('../../src/use_cases/get-article');
const ChapterRepository = require('../../src/domain/repositories/chapter-repository');
const chapterOfArticle = require('../fixtures/chapterOfArticleSaved');
const chapterWithParagraphs = require('../fixtures/chapterWithParagraphs');

describe('Unit | GetArticle | getAllChapters', () => {
  const dropboxId = 8;

  beforeEach(() => {
    sinon.stub(ChapterRepository, 'getChaptersOfArticle').resolves([chapterOfArticle()]);
  });

  afterEach(() => {
    ChapterRepository.getChaptersOfArticle.restore();
  });

  it('should call ChapterRepository to getChaptersOfArticle articles', () => {
    // when
    GetArticle.getAllChapters(dropboxId);

    // then
    expect(ChapterRepository.getChaptersOfArticle).to.have.been.calledWith(dropboxId);
  });

  it('should return chapters with paragraphs', () => {
    // when
    const promise = GetArticle.getAllChapters(dropboxId);

    // then
    promise.then((chapters) => {
      return expect(chapters).to.deep.equal([chapterWithParagraphs()]);
    });
  });
});

