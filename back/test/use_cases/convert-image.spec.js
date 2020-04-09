import { expect, sinon } from '../test-helper'
import DropboxClient from '../../src/infrastructure/external_services/dropbox-client'
import ConvertImage from '../../src/use_cases/convert-image'

describe.only('Unit | ConvertImage | convertImage', () => {
  const jpgFile = {}

  beforeEach(() => {
    sinon.stub(DropboxClient, 'filesDownload').resolves(jpgFile)
    sinon.stub(DropboxClient, 'filesUpload').resolves(true)
  })
  afterEach(() => {
    DropboxClient.filesDownload.restore()
    DropboxClient.filesUpload.restore()
  })

  it('should download image from dropbox', async () => {
    // When
    await ConvertImage.convertImage()

    // Then
    expect(DropboxClient.filesDownload).to.have.been.calledWith('/85/img0.jpg')
  })

  xit('should convert to webp', () => {
    // Given

    // When

    // Then
    expect().to
  })

  it('should upload to dropbox', async () => {
    // When
    await ConvertImage.convertImage()

    // Then
    expect(DropboxClient.filesUpload).to.have.been.calledWith({path: '/85/img0.webp', file: jpgFile})
  })

  it('should throw error', async () => {
    // Given
    DropboxClient.filesUpload.restore()
    sinon.stub(DropboxClient, 'filesUpload').rejects('error')
    sinon.stub(console, 'error')

    // When
    try {
      await ConvertImage.convertImage()
    } catch (error) {
      expect(error.message).to.equal('error')
    } finally {
      console.error.restore()
    }
  })
})

