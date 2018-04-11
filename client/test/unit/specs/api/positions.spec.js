import axios from 'axios';
import positionsApi from '@/api/positions';

describe('Unit | API | positions api', () => {
  describe('#fetchLast', () => {
    let data;

    beforeEach(() => {
      data = {
        lastPosition: 'Cancun, Mexico, le 5 mars 2018',
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

    it('should fetchLast API with the good params', () => {
      // given
      const expectedUrl = `${process.env.API_URL}positions/last`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = positionsApi.fetchLast();

      // then
      return promise.then(() => {
        expect(axios.get).to.have.been.calledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = positionsApi.fetchLast();

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).to.equal(data.lastPosition);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      axios.get.rejects(new Error('some error'));

      // when
      const promise = positionsApi.fetchLast();

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
