import axios from 'axios';
import api from '@/api/subscriptions';

describe('Unit | API | subscriptions api', () => {
  describe('#sendSubscription', () => {
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

    it('should post subscriptions to API with the email', () => {
      // given
      const email = 'pierre@recontact.me';

      const expectedUrl = 'http://localhost:3001/api/subscriptions';
      const expectedBody = { email };
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } };

      // when
      const promise = api.subscribe(email);

      // then
      return promise.then(() => {
        expect(axios.post).to.have.been.calledWith(expectedUrl, expectedBody, expectedOptions);
      });
    });

    it('should return a rejected promise when an error is thrown', (done) => {
      // given
      axios.post.rejects(new Error('some error'));
      const email = 'pierre@recontact.me';

      // when
      const promise = api.subscribe(email);

      // then
      promise.catch((error) => {
        expect(error.message).to.equal('some error');
        done();
      });
    });
  });
});
