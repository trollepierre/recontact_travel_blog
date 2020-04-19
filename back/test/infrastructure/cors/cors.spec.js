import { expect, sinon } from '../../test-helper'
import { corsOptions } from '../../../src/infrastructure/cors/cors'

describe('corsOptions', () => {
  it('should accept local url', () => {
    // Given
    const origin = 'http://localhost:3000'
    const callback = sinon.spy()

    // When
    corsOptions.origin(origin, callback)

    // Then
    expect(callback).to.have.been.calledWith(null, true)
  })

  it('should accept prod url', () => {
    // Given
    const origin = 'https://www.recontact.me'
    const callback = sinon.spy()

    // When
    corsOptions.origin(origin, callback)

    // Then
    expect(callback).to.have.been.calledWith(null, true)
  })

  it('should accept prod fr url', () => {
    // Given
    const origin = 'https://fr.recontact.me'
    const callback = sinon.spy()

    // When
    corsOptions.origin(origin, callback)

    // Then
    expect(callback).to.have.been.calledWith(null, true)
  })

  it('should accept test fr url', () => {
    // Given
    const origin = 'https://french-test.recontact.me'
    const callback = sinon.spy()

    // When
    corsOptions.origin(origin, callback)

    // Then
    expect(callback).to.have.been.calledWith(null, true)
  })

  it('should accept test en url', () => {
    // Given
    const origin = 'https://english-test.recontact.me'
    const callback = sinon.spy()

    // When
    corsOptions.origin(origin, callback)

    // Then
    expect(callback).to.have.been.calledWith(null, true)
  })

  it('should not accept random url', () => {
    // Given
    const origin = 'blabla.orl'
    const callback = sinon.spy()

    // When
    corsOptions.origin(origin, callback)

    // Then
    expect(callback).not.to.have.been.calledWith(null, true)
    expect(callback).to.have.been.called
  })
})
