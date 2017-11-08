import axios from 'axios';
import api from '@/api/articles';

describe('Unit | API | articles api', () => {
  describe('#fetchAll', () => {
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
      const expectedUrl = `${process.env.API_URL}api/articles`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = api.fetchAll();

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
      const promise = api.fetchAll(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });

  describe('#updateArticle', () => {
    const id = 59;

    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      };
      sinon.stub(axios, 'patch').resolves(stubbedResponse);
    });

    afterEach(() => {
      axios.patch.restore();
    });

    it('should patch API with the good params', () => {
      // given
      const expectedUrl = `${process.env.API_URL}api/admin/articles/${id}`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = api.update(id);

      // then
      return promise.then(() => {
        expect(axios.patch).to.have.been.calledWith(expectedUrl, {}, expectedOptions);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      const accessToken = 'invalid-access_token';
      axios.patch.rejects(new Error('some error'));

      // when
      const promise = api.update(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
