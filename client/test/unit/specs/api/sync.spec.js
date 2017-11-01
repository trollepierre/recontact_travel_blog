import axios from 'axios';
import syncApi from '@/api/sync';

describe('Unit | API | sync api', () => {
  describe('#launch', () => {
    let stubbedResponse;

    beforeEach(() => {
      stubbedResponse = {
        status: 200,
      };
      sinon.stub(axios, 'get').resolves(stubbedResponse);
    });

    afterEach(() => {
      axios.get.restore();
    });

    it('should launch API with the good params', () => {
      // given
      const expectedUrl = `${process.env.API_URL}api/sync/`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = syncApi.launch();

      // then
      return promise.then(() => {
        expect(axios.get).to.have.been.calledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = syncApi.launch();

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).to.equal(stubbedResponse);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      const accessToken = 'invalid-access_token';
      axios.get.rejects(new Error('some error'));

      // when
      const promise = syncApi.launch(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
