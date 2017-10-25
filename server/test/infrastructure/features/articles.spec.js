// const { request, expect, sinon } = require('../../test-helper');
// const app = require('../../../app');
// const ChaptersSerializer = require('../../src/serializers/chapters');
// const ArticleService = require('../../../src/domain/database_services/article-service');
// const ChapterService = require('../../../src/domain/database_services/chapter-service');
//
// describe('Integration | Routes | articles route', () => {
//   const expectedArticles = [
//     {
//       name: '58',
//       imgLink: '/58/img0.jpg',
//     },
//     {
//       name: '59',
//       imgLink: '/59/img0.jpg',
//     },
//   ];
//
//   describe('/articles', () => {
//     beforeEach(() => {
//       sinon.stub(ArticleService, 'getAll').resolves(expectedArticles);
//     });
//
//     afterEach(() => {
//       ArticleService.getAll.restore();
//     });
//
//     it('should call ArticleService to getAll before sending json', (done) => {
//       // When
//       request(app)
//         .get('/api/articles')
//         .expect('Content-Type', /json/)
//         .end((err, response) => {
//           // Then
//           expect(ArticleService.getAll).to.have.been.called;
//           expect(response.body).to.deep.equal(expectedArticles);
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });
//   });
//
//   describe('/articles/:id', () => {
//     beforeEach(() => {
//       sinon.stub(ChapterService, 'getChaptersOfArticle').resolves('chapters');
//       sinon.stub(ChaptersSerializer, 'addParagraphs').resolves('serializedChapters');
//     });
//
//     afterEach(() => {
//       ChapterService.getChaptersOfArticle.restore();
//       ChaptersSerializer.addParagraphs.restore();
//     });
//
//     it('should call ChapterService to getChaptersOfArticle, serialize it before sending json', (done) => {
//       // Given
//       const idArticle = 59;
//       const stringIdArticle = '59';
//
//       // When
//       request(app)
//         .get(`/api/articles/${idArticle}`)
//         .expect('Content-Type', /json/)
//         .end((err, response) => {
//           // Then
//           expect(ChapterService.getChaptersOfArticle).to.have.been.calledWith(stringIdArticle);
//           expect(ChaptersSerializer.addParagraphs).to.have.been.calledWith('chapters');
//           expect(response.body).to.deep.equal('serializedChapters');
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });
//   });
// });
