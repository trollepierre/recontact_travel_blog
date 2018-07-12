import Vue from 'vue';
import ChapterCard from './ChapterCard';
import translationsService from '../services/translations';
import VueI18n from 'vue-i18n';

describe('Component | ChapterCard.vue', () => {
  let wrapper
  let chapter;
    let localVue;

  beforeEach(() => {
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title');
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['one text']);
    chapter = {
      frTitle: 'Titre du premier paragraphe',
      enTitle: 'Title of the first paragraph',
      imgLink: 'webf',
      frText: 'du blabla',
      enText: 'some blabla',
    };
    const propsData = {
      chapter,
    };
    localVue = createLocalVue()
    localVue.use(VueI18n)
    wrapper = shallowMount(ChapterCard, { localVue, propsData })
  });

  it('should be named "ChapterCard"', () => {
    expect(wrapper.name()).toEqual('ChapterCard');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  xdescribe('render', () => {
    it('should render chapter title', () => {
      const chapterTitle = wrapper.find('h2');
      expect(chapterTitle.textContent).toEqual('My title');
    });

    it('should render chapter image', () => {
      const chapterLink = wrapper.find('img');
      expect(chapterLink.getAttribute('src')).toContain('webf');
    });

    it('should render chapter text', () => {
      const chapterTitle = wrapper.findAll('.chapter__footer_text p');
      expect(chapterTitle.length).toEqual(1);
      expect(chapterTitle[0].textContent).toEqual('one text');
    });

    it('should not render a span text with Image manquante', () => {
      const missingImage = wrapper.find('span');
      expect(missingImage).to.be.null;
    });
  });

  xdescribe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {

      chapter.imgLink = 'dropbox.com/img0.jpg';


      const { imgLink } = component;


      expect(imgLink).toEqual('dropbox.com/img0.jpg');
    });

    it('should return false when api status is undefined', () => {

      chapter.imgLink = '';


      const { imgLink } = component;


      expect(imgLink).toEqual(false);
    });
  });
});

xdescribe('ChapterCard.vue when imgLink not set', () => {
  let wrapper
  let chapter;

  beforeEach(() => {
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title');
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['one text']);

    chapter = {
      frTitle: 'Titre du premier paragraphe',
      enTitle: 'Title of the first paragraph',
      imgLink: '',
      frText: 'du blabla',
      enText: 'some blabla',
    };
    const propsData = {
      chapter,
    };
    localVue = createLocalVue()
    localVue.use(VueI18n)
    wrapper = shallowMount(ChapterCard, { localVue, propsData })
  });

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  xdescribe('render', () => {
    it('should not render chapter image', () => {
      const chapterLink = wrapper.find('img');
      expect(chapterLink).to.be.null;
    });

    it('should render a span text with Image manquante', () => {
      const missingImage = wrapper.find('span');
      expect(missingImage.innerText).toContain('missingImage');
    });
  });

  describe('locales', () => {
    const languages = Object.keys(ChapterCard.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.fr);

        it('contains 1 locale', () => {
          expect(locales.length).toEqual(1);
          expect(locales).toEqual([
            'missingImage',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.en);

        it('contains 1 locale', () => {
          expect(locales.length).toEqual(1);
          expect(locales).toEqual([
            'missingImage',
          ]);
        });
      });
    });
  });
});

