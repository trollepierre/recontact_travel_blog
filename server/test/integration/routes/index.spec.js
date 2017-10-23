const { request, sinon } = require('../../test-helper');
const app = require('../../../app');
const dropboxToArticlesService = require('../../../src/use_cases/synchronize-articles');

describe('Integration | Routes | index route', () => {
  beforeEach(() => {
    sinon.stub(dropboxToArticlesService, 'synchronizeArticles').resolves();
  });

  afterEach(() => {
    dropboxToArticlesService.synchronizeArticles.restore();
  });

  it('should have api informations on root', (done) => {
    request(app)
      .get('/')
      .end((err) => {
        if (err) {
          done(err);
        }
        done();
      });
  });
});
