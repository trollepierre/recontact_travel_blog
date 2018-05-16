import translationsService from '@/services/translations';

describe('Unit | services | translations', () => {
  let navigatorLanguage;

  beforeEach(() => {
    navigatorLanguage = sinon.stub(translationsService, 'getNavigatorLanguage');
  });

  afterEach(() => {
    translationsService.getNavigatorLanguage.restore();
  });

  describe('#getTitle', () => {
    it('should return enTitle by default', () => {
      // given
      navigatorLanguage.returns('en-En');
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getTitle(article);

      // then
      expect(title).to.equal('The title');
    });

    it('should return dropboxId when enTitle is empty', () => {
      // given
      navigatorLanguage.returns('en-En');
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
      };

      // when
      const title = translationsService.getTitle(article);

      // then
      expect(title).to.equal(59);
    });

    it('should return frTitle when navigator language is French', () => {
      // given
      navigatorLanguage.returns('fr-Fr');
      const article = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getTitle(article);

      // then
      expect(title).to.equal('Le titre');
    });
  });

  describe('#getChapterTitle', () => {
    it('should return enTitle by default', () => {
      // given
      navigatorLanguage.returns('en-en');
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getChapterTitle(chapter);

      // then
      expect(title).to.equal('The title');
    });

    it('should return frTitle when navigator language is French', () => {
      // given
      navigatorLanguage.returns('fr-Fr');
      const chapter = {
        dropboxId: 59,
        frTitle: 'Le titre',
        enTitle: 'The title',
      };

      // when
      const title = translationsService.getChapterTitle(chapter);

      // then
      expect(title).to.equal('Le titre');
    });
  });

  describe('#getChapterText', () => {
    it('should return enTitle by default', () => {
      // given
      navigatorLanguage.returns('en-en');
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
      expect(title).to.equal(enText);
    });

    it('should return frTitle when navigator language starts by French', () => {
      // given
      navigatorLanguage.returns('fr-Fr');

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
      expect(title).to.equal(frText);
    });
  });
});
