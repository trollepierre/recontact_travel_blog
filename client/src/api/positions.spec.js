import axios from 'axios';
import positionsApi from './positions';
import env from '../env/env.js'

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
      axios.get = jest.fn()
      axios.get.mockResolvedValue(stubbedResponse)
    });

    it('should fetchLast API with the good params', () => {
      // given
      const expectedUrl = `${env('API_URL')}api/positions/last`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = positionsApi.fetchLast();

      // then
      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = positionsApi.fetchLast();

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).toEqual(data);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      axios.get.mockRejectedValue(new Error('some error'));

      // when
      const promise = positionsApi.fetchLast();

      // then
      promise.catch((error) => {
        expect(error.message).toEqual('some error');
        done();
      });
    });
  });

  describe('#add', () => {
    let data;

    beforeEach(() => {
      data = {
        lastPosition: 'Cancun, Mexico, le 5 mars 2018',
      };
      const stubbedResponse = {
        status: 200,
        data,
      };
      sinon.stub(axios, 'post').resolves(stubbedResponse);
    });

    afterEach(() => {
      axios.post.restore();
    });

    it('should set last position thanks to API with the good params', () => {
      // given
      const position = {
        lastPosition: 'Cancun, Mexico, le 5 mars 2018',
      };
      const expectedUrl = `${env('API_URL')}api/positions`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = positionsApi.add(position);

      // then
      return promise.then(() => {
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, position, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = positionsApi.add();

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).toEqual(data);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      axios.post.mockRejectedValue(new Error('some error'));

      // when
      const promise = positionsApi.add();

      // then
      promise.catch((error) => {
        expect(error.message).toEqual('some error');
        done();
      });
    });
  });
});
