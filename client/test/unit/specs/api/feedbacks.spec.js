import axios from 'axios';
import api from '@/api/feedbacks';

describe('Unit | API | feedbacks api', () => {
  describe('#sendFeedback', () => {
    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      };
      sinon.stub(axios, 'post').resolves(stubbedResponse);
    });

    afterEach(() => {
      axios.post.restore();
    });

    it('should post feedbacks to API with the feedback and email', () => {
      // given
      const email = 'pierre@recontact.me';
      const feedback = 'Vive le Tour de France !';

      const expectedUrl = `${process.env.API_URL}api/feedbacks`;
      const expectedBody = { feedback, email };
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = api.sendFeedback(feedback, email);

      // then
      return promise.then(() => {
        expect(axios.post).to.have.been.calledWith(expectedUrl, expectedBody, expectedOptions);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      axios.post.rejects(new Error('some error'));
      const feedback = 'coucou';
      const email = 'pierre@recontact.me';

      // when
      const promise = api.sendFeedback(feedback, email);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
