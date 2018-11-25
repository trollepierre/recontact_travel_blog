const { request, expect, sinon } = require('../../test-helper')
const app = require('../../../app')
const Subscribe = require('../../../src/use_cases/subscribe')

describe('Integration | Routes | subscriptions route', () => {
  describe('POST /api/subscriptions', () => {
    const email = 'mail@recontact.me'

    beforeEach(() => {
      sinon.stub(Subscribe, 'subscribe')
    })

    afterEach(() => {
      Subscribe.subscribe.restore()
    })

    it('should call Subscribe#subscribe', (done) => {
      // given
      const persistedSubscription = { id: 1, email: 'mail@recontact.me', lang: 'en' }
      Subscribe.subscribe.resolves({ subscription: persistedSubscription, created: false })

      // when
      request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send({ email, lang: 'en' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(Subscribe.subscribe).to.have.been.calledWith({ email: 'mail@recontact.me', lang: 'en' })
          expect(res.body).to.deep.equal(persistedSubscription)
          done()
        })
    })

    it('should return 200 when a subscription already exists', () => {
      // given
      Subscribe.subscribe.resolves({ subscription: {}, created: false })

      // when
      return request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send({ email })
        .expect(200)
    })

    it('should return 201 when the subscription did not exist for the given email', () => {
      // given
      Subscribe.subscribe.resolves({ subscription: {}, created: true })

      // when
      return request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(201)
    })

    it('should return 403 when subscription service throws an error', () => {
      // given
      Subscribe.subscribe.rejects(new Error('Some error'))

      // when
      return request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(403)
    })
  })
})
