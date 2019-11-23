import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import DeleteSubscription from '../../../src/use_cases/delete-subscription'
import GetAllSubscriptions from '../../../src/use_cases/get-all-subscriptions'

describe('Integration | Routes | optimisation route', () => {
  describe('DELETE /api/subscriptions/:subscription_id', () => {
    beforeEach(() => {
      sinon.stub(DeleteSubscription, 'deleteSubscription').resolves()
    })

    afterEach(() => {
      DeleteSubscription.deleteSubscription.restore()
    })

    it('should call subscriptionService#deleteById', done => {
      // when
      request(app)
        .get('/api/apo/sub/del/1234')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(204, () => {
          // then
          expect(DeleteSubscription.deleteSubscription).to.have.been.calledWith(1234)
          done()
        })
    })
  })

  describe('GET /api/subscriptions/', () => {
    let persistedSubscriptions
    beforeEach(() => {
      sinon.stub(GetAllSubscriptions, 'getAllSubscriptions')
      persistedSubscriptions = [{ id: 1, email: 'mail@recontact.me' }]
      GetAllSubscriptions.getAllSubscriptions.resolves(persistedSubscriptions)
    })

    afterEach(() => {
      GetAllSubscriptions.getAllSubscriptions.restore()
    })

    it('should call GetAllSubscriptions#getAllSubscriptions', done => {
      // when
      request(app)
        .get('/api/apo/sub/')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(GetAllSubscriptions.getAllSubscriptions).to.have.been.calledWith()
          expect(res.body).to.deep.equal(persistedSubscriptions)
          done()
        })
    })
  })

  describe('DELETE /apo/subscriptions/:subscription_id', () => {
    beforeEach(() => {
      sinon.stub(DeleteSubscription, 'deleteSubscription').resolves()
    })

    afterEach(() => {
      DeleteSubscription.deleteSubscription.restore()
    })

    it('should call subscriptionService#deleteById', done => {
      // when
      request(app)
        .get('/apo/sub/del/1234')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(204, () => {
          // then
          expect(DeleteSubscription.deleteSubscription).to.have.been.calledWith(1234)
          done()
        })
    })
  })

  describe('GET /apo/subscriptions/', () => {
    let persistedSubscriptions
    beforeEach(() => {
      sinon.stub(GetAllSubscriptions, 'getAllSubscriptions')
      persistedSubscriptions = [{ id: 1, email: 'mail@recontact.me' }]
      GetAllSubscriptions.getAllSubscriptions.resolves(persistedSubscriptions)
    })

    afterEach(() => {
      GetAllSubscriptions.getAllSubscriptions.restore()
    })

    it('should call GetAllSubscriptions#getAllSubscriptions', done => {
      // when
      request(app)
        .get('/apo/sub/')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(GetAllSubscriptions.getAllSubscriptions).to.have.been.calledWith()
          expect(res.body).to.deep.equal(persistedSubscriptions)
          done()
        })
    })
  })
})
