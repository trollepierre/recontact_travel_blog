const { expect, sinon } = require('../test-helper');
const GetAllArticles = require('../../src/use_cases/get-all-articles');
const ArticleService = require('../../src/domain/database_services/article-service');

describe('Unit | GetAllArticles | getAllArticles', () => {
  beforeEach(() => {
    sinon.stub(ArticleService, 'getAll').returns('articles');
  });

  afterEach(() => {
    ArticleService.getAll.restore();
  });

  it('should call ArticleService to getAll articles to return', () => {
    // when
    const articles = GetAllArticles.getAllArticles();

    // then
    expect(ArticleService.getAll).to.have.been.calledWith();
    expect(articles).to.deep.equal('articles');
  });
});

