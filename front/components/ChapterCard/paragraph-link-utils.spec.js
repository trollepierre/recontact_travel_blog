import {
  generateCleanUrlLink, generateIframeLink, urlTester, youtubeEmbedUrlTester,
} from './paragraph-link-utils'

describe('paragraph-link-utils', () => {
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
        'www.recontact.me',
        'www.rec.me',
        'www.recontact.me/articles/84',
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

  describe('generateIframeLink', () => {
    it('should add my own channel video as next + remove youtube branding', () => {
      // When
      const iframeSrc = generateIframeLink('https://www.youtube.com/embed/b03ffclCkIM')

      // Then
      expect(iframeSrc).toEqual('https://www.youtube.com/embed/b03ffclCkIM?rel=0&modestbranding=1')
    })
  })

  describe('generateCleanUrlLink', () => {
    it('should add https when protocol is missing', () => {
      // When
      const link = generateCleanUrlLink('www.recontact.me/articles/84')

      // Then
      expect(link).toEqual('https://www.recontact.me/articles/84')
    })

    it('should not add when protocol exists', () => {
      // When
      const link = generateCleanUrlLink('https://www.recontact.me/articles/84')

      // Then
      expect(link).toEqual('https://www.recontact.me/articles/84')
    })
  })
})
