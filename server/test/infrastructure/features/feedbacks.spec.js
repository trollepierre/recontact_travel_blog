const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const mailService = require('../../../src/use_cases/mail-service');

describe('Integration | Routes | feedbacks route', () => {
  const email = 'mail@recontact.me';
  const feedback = 'Lorem ipsum dolor sit amet';

  beforeEach(() => {
    sinon.stub(mailService, 'sendFeedbackEmail').resolves();
  });

  afterEach(() => {
    mailService.sendFeedbackEmail.restore();
  });

  it('should call mailing service', (done) => {
    // when
    request(app)
      .post('/api/feedbacks')
      .send({ email, feedback })
      .set('Authorization', 'Bearer access-token')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201, (err, res) => {
        // then
        expect(res.body).to.deep.equal('Feedback sent');
        expect(mailService.sendFeedbackEmail).to.have.been.calledWith({ email, feedback });
        done();
      });
  });

  it('should return error status and error', (done) => {
    // Given
    mailService.sendFeedbackEmail.rejects();

    // When
    request(app)
      .post('/api/feedbacks')
      .send({ email, feedback })
      .set('Authorization', 'Bearer access-token')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(500, (err, res) => {
        if (err) {
          done(err);
        }

        // Then
        expect(res.body).to.deep.equal({ error: {} });
        done();
      });
  });
});
