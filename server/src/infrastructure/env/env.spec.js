// import dotenv from 'dotenv-extended'
// import { env } from './process'
//
// jest.mock('dotenv-extended')
// jest.mock('./process')
//
// const processVars = {
//   god: 'damnit',
//   holy: 'fuck',
// }
// const dotenvVars = {
//   holy: 'shit',
//   jesus: 'christ',
// }
//
// let varEnv
// beforeEach(() => {
//   dotenv.load.mockImplementation(() => dotenvVars)
//   env.mockImplementation(key => processVars[key])
//   /* eslint-disable global-require */
//   varEnv = require('./env').default
// })
//
// describe('when asking for an unknown key', () => {
//   it('should return undefined', () => {
//     expect(varEnv('cyka')).toBeUndefined()
//   })
// })
//
// describe('when asking for a non-overriden process key', () => {
//   it('should return the corresponding value', () => {
//     expect(varEnv('god')).toEqual(processVars.god)
//   })
// })
//
// describe('when asking for a overriden process key', () => {
//   it('should return the original value (not overridden)', () => {
//     expect(varEnv('holy')).toEqual(processVars.holy)
//   })
// })
//
// describe('when asking for an unknown process key, defined only in dotenv', () => {
//   it('should return the corresponding value', () => {
//     expect(varEnv('jesus')).toEqual(dotenvVars.jesus)
//   })
// })
