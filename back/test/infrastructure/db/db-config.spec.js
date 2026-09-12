import Sequelize from 'sequelize'
import { expect, sinon } from '../../test-helper'
import { productionDatabaseUrl } from '../../../src/infrastructure/db/db-config'
import * as envModule from '../../../src/infrastructure/env/env'

describe('Unit | Infrastructure | db-config | #productionDatabaseUrl', () => {
  let envStub

  // what heroku actually hands over: credentials, and sslmode=require.
  // Assembled from parts rather than written as one literal, so that secret
  // scanners do not read the connection URI as a leaked credential.
  const USER = 'db-user'
  const PASSWORD = 'p@ssword'
  const HOST = 'ec2-1-2-3-4.compute.amazonaws.com'
  const herokuUrl = (query = '?sslmode=require') => {
    const credentials = `${USER}:${encodeURIComponent(PASSWORD)}`
    return `postgres://${credentials}@${HOST}:5432/dbname${query}`
  }

  const connect = () => new Sequelize(productionDatabaseUrl(), { dialect: 'postgres' })

  beforeEach(() => {
    envStub = sinon.stub(envModule, 'default').returns(herokuUrl())
  })

  afterEach(() => {
    envStub.restore()
  })

  it('should make pg accept the self-signed certificate chain of heroku', () => {
    // Sequelize 6 assigns pgConnectionString.parse(uri) over dialectOptions, so
    // ssl passed as an option next to the uri is dropped; and since pg 8.16 a
    // bare sslmode=require means verify-full, which refuses heroku's chain.
    // Getting this wrong crashes the app at boot with SELF_SIGNED_CERT_IN_CHAIN.
    // when
    const { dialectOptions } = connect().options

    // then
    expect(dialectOptions.ssl).to.deep.equal({ rejectUnauthorized: false })
  })

  it('should override an sslmode already set on the url', () => {
    // given
    envStub.returns(herokuUrl('?sslmode=verify-full'))

    // when
    const { dialectOptions } = connect().options

    // then
    expect(dialectOptions.ssl).to.deep.equal({ rejectUnauthorized: false })
  })

  it('should say what is missing when DATABASE_URL is not set', () => {
    // given
    envStub.returns(undefined)

    // then
    // otherwise `new URL(undefined)` throws a bare "Invalid URL" at boot
    expect(() => productionDatabaseUrl()).to.throw('DATABASE_URL is required')
  })

  it('should keep the credentials and the target of the original url', () => {
    // when
    const { config } = connect()

    // then
    expect(config.host).to.equal(HOST)
    expect(config.port).to.equal('5432')
    expect(config.database).to.equal('dbname')
    expect(config.username).to.equal(USER)
    expect(config.password).to.equal(PASSWORD)
  })
})
