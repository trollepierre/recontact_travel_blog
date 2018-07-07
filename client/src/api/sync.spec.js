import axios from 'axios';
import syncApi from './sync';
import env from '../env/env.js'

describe('Unit | API | sync api', () => {
  describe('#launch', () => {
    let stubbedResponse;

    beforeEach(() => {
      stubbedResponse = {
        status: 200,
      };
      axios.patch = jest.fn()
      axios.patch.mockResolvedValue(stubbedResponse)
    });

    it('should launch API with the good params', () => {
      // given
      const expectedUrl = `${env('API_URL')}api/sync/`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = syncApi.launch();

      // then
      return promise.then(() => {
        expect(axios.patch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = syncApi.launch();

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).toEqual(stubbedResponse);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      const accessToken = 'invalid-access_token';
      axios.patch.mockRejectedValue(new Error('some error'));

      // when
      const promise = syncApi.launch(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).toEqual('some error');
        done();
      });
    });
  });
});
