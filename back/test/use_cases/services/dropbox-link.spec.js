import { expect } from '../../test-helper'
import { toRawImgLink } from '../../../src/use_cases/services/dropbox-link'

describe('Unit | UseCase | Services | dropbox-link | #toRawImgLink', () => {
  it('should serve the file directly on a modern /scl/fi/ link', () => {
    // this is what sharingCreateSharedLinkWithSettings and sharingListSharedLinks
    // return today; the previous `/s/raw/` rewrite read undefined on it and threw,
    // killing the process in the middle of a synchronisation
    // given
    const response = { url: 'https://www.dropbox.com/scl/fi/abc123/img0.jpg?rlkey=k3y&dl=0' }

    // when
    const link = toRawImgLink(response)

    // then
    expect(link).to.equal('https://www.dropbox.com/scl/fi/abc123/img0.jpg?rlkey=k3y&raw=1')
  })

  it('should serve the file directly on a legacy /s/ link', () => {
    // given
    const response = { url: 'https://www.dropbox.com/s/tk2qzdf6u1brv6o/img0.jpg?dl=0' }

    // when
    const link = toRawImgLink(response)

    // then
    expect(link).to.equal('https://www.dropbox.com/s/tk2qzdf6u1brv6o/img0.jpg?raw=1')
  })

  it('should add the parameter on a link that has no query string', () => {
    // given
    const response = { url: 'https://www.dropbox.com/scl/fi/abc123/img0.jpg' }

    // when
    const link = toRawImgLink(response)

    // then
    expect(link).to.equal('https://www.dropbox.com/scl/fi/abc123/img0.jpg?raw=1')
  })

  it('should return an empty link when dropbox returned nothing', () => {
    // when / then
    expect(toRawImgLink({})).to.equal('')
  })

  it('should return an empty link rather than throw when the answer has no url', () => {
    // when / then
    expect(toRawImgLink({ path: '/59/img0.jpg' })).to.equal('')
  })
})
