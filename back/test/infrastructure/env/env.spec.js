import * as process from '../../../src/infrastructure/env/process'
import { expect, sinon } from '../../test-helper'

describe('env', () => {
  const processVars = {
    god: 'damnit',
    holy: 'fuck',
  }
  const dotenvVars = {
    holy: 'shit',
    jesus: 'christ',
  }

  let varEnv

  beforeEach(() => {
    sinon.stub(process, 'envKey').callsFake(key => processVars[key])
    /* eslint-disable global-require */
    varEnv = require('../../../src/infrastructure/env/env').default
  })

  afterEach(() => {
    process.envKey.restore()
  })

  describe('when asking for an unknown key', () => {
    it('should return undefined', () => {
      expect(varEnv('cyka')).to.equal(undefined)
    })
  })

  describe('when asking for a non-overriden process key', () => {
    it('should return the corresponding value', () => {
      expect(varEnv('god')).to.equal(processVars.god)
    })
  })

  describe('when asking for a overriden process key', () => {
    it('should return the original value (not overridden)', () => {
      expect(varEnv('holy')).to.equal(processVars.holy)
    })
  })

  describe.skip('when asking for an unknown process key, defined only in dotenv', () => {
    it('should return the corresponding value', () => {
      expect(varEnv('jesus')).to.equal(dotenvVars.jesus)
    })
  })
})
