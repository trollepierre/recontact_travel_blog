import express from 'express'
import { expect, request } from '../../test-helper'
import staticEnv from '../../../src/infrastructure/env/static-env'

describe('Integration | env | static-env', () => {
  const app = express()
  app.use('/env.js', staticEnv)

  let previousToken

  beforeEach(() => {
    previousToken = process.env.MAPBOX_TOKEN
    process.env.MAPBOX_TOKEN = 'pk.test'
  })

  afterEach(() => {
    if (previousToken === undefined) {
      delete process.env.MAPBOX_TOKEN
    } else {
      process.env.MAPBOX_TOKEN = previousToken
    }
  })

  it('should expose the dyno configuration to the static front', done => {
    request(app)
      .get('/env.js')
      .end((err, response) => {
        if (err) {
          done(err)
          return
        }
        expect(response.status).to.equal(200)
        expect(response.headers['cache-control']).to.equal('no-store')
        expect(response.text).to.equal(
          'window.__ENV__=Object.assign(window.__ENV__||{},{"mapboxToken":"pk.test","apiBase":""});\n',
        )
        done()
      })
  })
})
