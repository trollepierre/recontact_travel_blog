import Vue from 'vue';
import ChapterCard from '@/components/ChapterCard';

describe('ChapterCard.vue', () => {
  let component;
  let chapter;

  beforeEach(() => {
    chapter = {
      title: 'Titre du premier paragraphe',
      imgLink: 'webf',
      text: 'some blabla',
    };
    const Constructor = Vue.extend(ChapterCard);
    component = new Constructor({
      propsData: {
        chapter,
      },
    }).$mount();
  });

  it('should be named "ChapterCard"', () => {
    expect(component.$options.name).to.equal('ChapterCard');
  });

  describe('render', () => {
    it('should render chapter title', () => {
      const chapterTitle = component.$el.querySelector('h2');
      expect(chapterTitle.textContent).to.equal('Titre du premier paragraphe');
    });

    it('should render chapter image', () => {
      const chapterLink = component.$el.querySelector('img');
      expect(chapterLink.getAttribute('src')).to.contain('webf');
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
      const imgLink = component.imgLink;

      // Then
      expect(imgLink).to.equal('dropbox.com/img0.jpg');
    });

    it('should return false when api status is undefined', () => {
      // Given
      chapter.imgLink = '';

      // When
      const imgLink = component.imgLink;

      // Then
      expect(imgLink).to.equal(false);
    });
  });
});

describe('ChapterCard.vue when imgLink not set', () => {
  let component;
  let chapter;

  beforeEach(() => {
    chapter = {
      title: 'Titre du premier paragraphe',
      imgLink: '',
      text: 'some blabla',
    };
    const Constructor = Vue.extend(ChapterCard);
    component = new Constructor({
      propsData: {
        chapter,
      },
    }).$mount();
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
      expect(languages.length).to.equal(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.fr);

        it('contains 1 locale', () => {
          expect(locales.length).to.equal(1);
          expect(locales).to.deep.equal([
            'missingImage',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.en);

        it('contains 1 locale', () => {
          expect(locales.length).to.equal(1);
          expect(locales).to.deep.equal([
            'missingImage',
          ]);
        });
      });
    });
  })
});

