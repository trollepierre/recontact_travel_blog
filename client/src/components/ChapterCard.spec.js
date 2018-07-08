import Vue from 'vue';
import ChapterCard from './ChapterCard';
import translationsService from '../services/translations';

xdescribe('Component | ChapterCard.vue', () => {
  let component;
  let chapter;

  beforeEach(() => {
    sinon.stub(translationsService, 'getChapterTitle').returns('My title');
    sinon.stub(translationsService, 'getChapterText').returns(['one text']);
    chapter = {
      frTitle: 'Titre du premier paragraphe',
      enTitle: 'Title of the first paragraph',
      imgLink: 'webf',
      frText: 'du blabla',
      enText: 'some blabla',
    };
    const Constructor = Vue.extend(ChapterCard);
    component = new Constructor({
      propsData: {
        chapter,
      },
    }).$mount();
  });

  afterEach(() => {
    translationsService.getChapterTitle.restore();
    translationsService.getChapterText.restore();
  });

  it('should be named "ChapterCard"', () => {
    expect(component.$options.name).toEqual('ChapterCard');
  });

  describe('render', () => {
    it('should render chapter title', () => {
      const chapterTitle = component.$el.querySelector('h2');
      expect(chapterTitle.textContent).toEqual('My title');
    });

    it('should render chapter image', () => {
      const chapterLink = component.$el.querySelector('img');
      expect(chapterLink.getAttribute('src')).to.contain('webf');
    });

    it('should render chapter text', () => {
      const chapterTitle = component.$el.querySelectorAll('.chapter__footer_text p');
      expect(chapterTitle.length).toEqual(1);
      expect(chapterTitle[0].textContent).toEqual('one text');
    });

    it('should not render a span text with Image manquante', () => {
      const missingImage = component.$el.querySelector('span');
      expect(missingImage).to.be.null;
    });
  });

  describe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {
      // Given
      chapter.imgLink = 'dropbox.com/img0.jpg';

      // When
      const { imgLink } = component;

      // Then
      expect(imgLink).toEqual('dropbox.com/img0.jpg');
    });

    it('should return false when api status is undefined', () => {
      // Given
      chapter.imgLink = '';

      // When
      const { imgLink } = component;

      // Then
      expect(imgLink).toEqual(false);
    });
  });
});

xdescribe('ChapterCard.vue when imgLink not set', () => {
  let component;
  let chapter;

  beforeEach(() => {
    sinon.stub(translationsService, 'getChapterTitle').returns('My title');
    sinon.stub(translationsService, 'getChapterText').returns(['one text']);
    chapter = {
      frTitle: 'Titre du premier paragraphe',
      enTitle: 'Title of the first paragraph',
      imgLink: '',
      frText: 'du blabla',
      enText: 'some blabla',
    };
    const Constructor = Vue.extend(ChapterCard);
    component = new Constructor({
      propsData: {
        chapter,
      },
    }).$mount();
  });

  afterEach(() => {
    translationsService.getChapterTitle.restore();
    translationsService.getChapterText.restore();
  });

  describe('render', () => {
    it('should not render chapter image', () => {
      const chapterLink = component.$el.querySelector('img');
      expect(chapterLink).to.be.null;
    });

    it('should render a span text with Image manquante', () => {
      const missingImage = component.$el.querySelector('span');
      expect(missingImage.innerText).to.contain('missingImage');
    });
  });

  describe('locales', () => {
    const languages = Object.keys(ChapterCard.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.fr);

        it('contains 1 locale', () => {
          expect(locales.length).toEqual(1);
          expect(locales).to.deep.equal([
            'missingImage',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.en);

        it('contains 1 locale', () => {
          expect(locales.length).toEqual(1);
          expect(locales).to.deep.equal([
            'missingImage',
          ]);
        });
      });
    });
  });
});

