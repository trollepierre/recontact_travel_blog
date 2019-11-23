import translationsService from './translations'

describe('Unit | services | translations', () => {
  let navigatorLanguage

  beforeEach(() => {
    navigatorLanguage = jest.fn()
    translationsService.getNavigatorLanguage = navigatorLanguage
  })

  describe('#getTitle', () => {
    it('should return enTitle by default', () => {
      navigatorLanguage.mockReturnValue('en-En')
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      }

      const title = translationsService.getTitle(article)

      expect(title).toEqual('The title')
    })

    it('should return dropboxId when enTitle is empty', () => {
      navigatorLanguage.mockReturnValue('en-En')
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
      }

      const title = translationsService.getTitle(article)

      expect(title).toEqual(59)
    })

    it('should return frTitle when navigator language is French', () => {
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      }

      const title = translationsService.getTitle(article, 'fr')

      expect(title).toEqual('Le titre')
    })
  })

  describe('#getChapterTitle', () => {
    it('should return enTitle by default', () => {
      navigatorLanguage.mockReturnValue('en')
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      }

      const title = translationsService.getChapterTitle(chapter)

      expect(title).toEqual('The title')
    })

    it('should return frTitle when navigator language is French', () => {
      navigatorLanguage.mockReturnValue('fr')
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      }

      const title = translationsService.getChapterTitle(chapter, 'fr')

      expect(title).toEqual('Le titre')
    })
  })

  describe('#getChapterText', () => {
    it('should return enTitle by default', () => {
      navigatorLanguage.mockReturnValue('en')
      const frText = [
        'Rassemblant trois valeureux compagnons  :',
      ]
      const enText = [
        'Gathering 3 glorious people',
      ]
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
        frText,
        enText,
      }

      const title = translationsService.getChapterText(chapter)

      expect(title).toEqual(enText)
    })

    it('should return frTitle when navigator language starts by French', () => {
      navigatorLanguage.mockReturnValue('fr')

      const frText = [
        'Rassemblant trois valeureux compagnons  :',
      ]
      const enText = [
        'Gathering 3 glorious people',
      ]
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
        frText,
        enText,
      }

      const title = translationsService.getChapterText(chapter, 'fr')

      expect(title).toEqual(frText)
    })
  })
})
