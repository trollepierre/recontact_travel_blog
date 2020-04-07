import { urlTester, youtubeEmbedUrlTester } from './urlTester'

describe('urlTester', () => {
  it('should return true whatever the link', () => {
    // Given
    const links = [
      'http://www.recontact.me',
      'https://www.recontact.me',
      'https://www.rec.me',
      'https://recontact.me',
      'https://youtu.be',
      'https://youtu.be/toto',
      'http://youtube.com/',
    ]

    // When
    links.map(text => {
      // Then
      expect(urlTester(text)).toBe(true)
    })
  })

  it('should return false whatever is not a link', () => {
    // Given
    const texts = [
      'www.recontact.me',
      'ssh://www.rec.me',
      'ftp://recontact.me',
      '&é"((§è!ç',
    ]

    // When
    texts.map(text => {
      // Then
      expect(urlTester(text)).toBe(false)
    })
  })
})

describe('youtubeEmbedUrlTester', () => {
  it('should return true whatever the link from youtube', () => {
    // Given
    const youtubeLinks = [
      'https://www.youtube.com/embed/-18AYp_7iW0',
    ]

    // When
    youtubeLinks.map(text => {
      // Then
      expect(youtubeEmbedUrlTester(text)).toBe(true)
    })
  })

  it('should return false whatever is not a link', () => {
    // Given
    const texts = [
      'https://youtu.be/-18AYp_7iW0',
      'https://wwww.youtube.com/watch?v=-18AYp_7iW0',
      'http://www.recontact.me',
      'https://www.recontact.me',
      'https://www.rec.me',
      'https://recontact.me',
      'www.recontact.me',
      'ssh://www.rec.me',
      'ftp://recontact.me',
      '&é"((§è!ç',
    ]

    // When
    texts.map(text => {
      // Then
      expect(youtubeEmbedUrlTester(text)).toBe(false)
    })
  })
})
