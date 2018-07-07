import translationsService from './translations';

describe('Unit | services | translations', () => {
  let navigatorLanguage;

  beforeEach(() => {
    navigatorLanguage = jest.fn()
    translationsService.getNavigatorLanguage = navigatorLanguage
  });

  describe('#getTitle', () => {
    it('should return enTitle by default', () => {
      // given
      navigatorLanguage.mockReturnValue('en-En');
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getTitle(article);

      // then
      expect(title).toEqual('The title');
    });

    it('should return dropboxId when enTitle is empty', () => {
      // given
      navigatorLanguage.mockReturnValue('en-En');
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
      };

      // when
      const title = translationsService.getTitle(article);

      // then
      expect(title).toEqual(59);
    });

    it('should return frTitle when navigator language is French', () => {
      // given
      navigatorLanguage.mockReturnValue('fr-Fr');
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getTitle(article);

      // then
      expect(title).toEqual('Le titre');
    });
  });

  describe('#getChapterTitle', () => {
    it('should return enTitle by default', () => {
      // given
      navigatorLanguage.mockReturnValue('en-en');
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getChapterTitle(chapter);

      // then
      expect(title).toEqual('The title');
    });

    it('should return frTitle when navigator language is French', () => {
      // given
      navigatorLanguage.mockReturnValue('fr-Fr');
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getChapterTitle(chapter);

      // then
      expect(title).toEqual('Le titre');
    });
  });

  describe('#getChapterText', () => {
    it('should return enTitle by default', () => {
      // given
      navigatorLanguage.mockReturnValue('en-en');
      const frText = [
        'Rassemblant trois valeureux compagnons :',
      ];
      const enText = [
        'Gathering 3 glorious people',
      ];
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
        frText,
        enText,
      };

      // when
      const title = translationsService.getChapterText(chapter);

      // then
      expect(title).toEqual(enText);
    });

    it('should return frTitle when navigator language starts by French', () => {
      // given
      navigatorLanguage.mockReturnValue('fr-Fr');

      const frText = [
        'Rassemblant trois valeureux compagnons :',
      ];
      const enText = [
        'Gathering 3 glorious people',
      ];
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
        frText,
        enText,
      };

      // when
      const title = translationsService.getChapterText(chapter);

      // then
      expect(title).toEqual(frText);
    });
  });
});
