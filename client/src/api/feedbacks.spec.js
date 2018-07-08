import axios from 'axios';
import api from './feedbacks';
import env from '../env/env.js'

describe('Unit | API | feedbacks api', () => {
  describe('#sendFeedback', () => {
    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      };
      axios.post = jest.fn()
      axios.post.mockResolvedValue(stubbedResponse)
    });

    it('should post feedbacks to API with the feedback and email', () => {

      const email = 'pierre@recontact.me';
      const feedback = 'Vive le Tour de France !';

      const expectedUrl = `${env('API_URL')}api/feedbacks`;
      const expectedBody = { feedback, email };
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };


      const promise = api.sendFeedback(feedback, email);


      return promise.then(() => {
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, expectedBody, expectedOptions);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {

      axios.post.mockRejectedValue(new Error('some error'));
      const feedback = 'coucou';
      const email = 'pierre@recontact.me';


      const promise = api.sendFeedback(feedback, email);


      promise.catch((error) => {
        expect(error.message).toEqual('some error');
        done();
      });
    });
  });
});
