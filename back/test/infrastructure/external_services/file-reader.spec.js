import axios from 'axios'
import File from '../../../src/infrastructure/external_services/file-reader'
import { expect, sinon } from '../../test-helper'

describe('Unit | Infrastructure | file', () => {
  describe('#read', () => {
    const filePath = 'https://dl.dropboxusercontent.com/apitl/1/AADgllr4r8'

    beforeEach(() => {
      sinon.stub(axios, 'get')
      axios.get.resolves({ data: { my: 'data' } })
    })

    afterEach(() => {
      axios.get.restore()
    })

    it('should return response body', () => {
      // when
      const promise = File.read(filePath)

      // then
      return promise.then(response => {
        expect(response).to.deep.equal({ my: 'data' })
      })
    })

    it('should call dropbox API "filesListFolder" with emptyPath', () => {
      // when
      File.read(filePath)

      // then
      expect(axios.get).to.have.been.calledWith(filePath)
    })
  })
})
