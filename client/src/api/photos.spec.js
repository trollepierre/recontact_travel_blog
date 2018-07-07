import axios from 'axios';
import photosApi from './photos';
import env from '../env/env.js'

describe('Unit | API | photos api', () => {
  describe('#fetch', () => {
    let idArticle;
    let data;

    beforeEach(() => {
      idArticle = 59;
      data = {
        foo: 'bar',
        photos: 'some photos',
      };
      const stubbedResponse = {
        status: 200,
        data,
      };
      axios.get = jest.fn()
      axios.get.mockResolvedValue(stubbedResponse);
    });

    it('should fetch API with the good params', () => {
      // given
      const expectedUrl = `${env('API_URL')}api/articles/${idArticle}/photos`;
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = photosApi.fetch(idArticle);

      // then
      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions);
      });
    });

    it('should return the response', () => {
      // when
      const promise = photosApi.fetch(idArticle);

      // then
      return promise.then((returnedChapters) => {
        expect(returnedChapters).toEqual(data);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      const accessToken = 'invalid-access_token';
      axios.get.mockRejectedValue(new Error('some error'));

      // when
      const promise = photosApi.fetch(accessToken);

      // then
      promise.catch((error) => {
        expect(error.message).toEqual('some error');
        done();
      });
    });
  });
});
