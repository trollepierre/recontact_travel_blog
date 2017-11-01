import axios from 'axios';
import chaptersApi from '@/api/chapters';

describe('Unit | API | chapters api', () => {
  describe('#fetch', () => {
    let idArticle;
    let data;

    beforeEach(() => {
      idArticle = 59;
      data = {
        foo: 'bar',
        chapters: 'some chapters',
      };
      const stubbedResponse = {
        status: 200,
        data,
      };
      sinon.stub(axios, 'get').resolves(stubbedResponse);
    });

    afterEach(() => {
      axios.get.restore();
    });

    it('should fetch API with the good params', () => {
      // given
      const expectedUrl = `${process.env.API_URL}api/articles/${idArticle}`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = chaptersApi.fetch(idArticle);

      // then
      return promise.then(() => {
        expect(axios.get).to.have.been.calledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = chaptersApi.fetch(idArticle);

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).to.equal(data);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      const accessToken = 'invalid-access_token';
      axios.get.rejects(new Error('some error'));

      // when
      const promise = chaptersApi.fetch(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
