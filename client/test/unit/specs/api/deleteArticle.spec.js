import axios from 'axios';
import api from '@/api/deleteArticle';

describe('Unit | API | deleteArticle api', () => {
  describe('#deleteArticle', () => {
    const id = 59;

    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      };
      sinon.stub(axios, 'get').resolves(stubbedResponse);
    });

    afterEach(() => {
      axios.get.restore();
    });

    it('should fetch API with the good params', () => {
      // given
      const expectedUrl = `${process.env.API_URL}api/admin/articles/${id}/delete`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = api.deleteArticle(id);

      // then
      return promise.then(() => {
        expect(axios.get).to.have.been.calledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      const accessToken = 'invalid-access_token';
      axios.get.rejects(new Error('some error'));

      // when
      const promise = api.deleteArticle(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
