import Vue from 'vue';
import router from '../router/router';
import photosApi from '../api/photos';
import chaptersApi from '../api/chapters';
import ArticlePage from './ArticlePage';
import translationsService from '../services/translations';

xdescribe('Component | ArticlePage.vue', () => {
  let wrapper
  let chapters;
  let photos;
  const title = 'Pierre au pays des';
  const idArticle = 8;

  beforeEach(() => {
    sinon.stub(translationsService, 'getChapterTitle').returns('My title');
    sinon.stub(translationsService, 'getChapterText').returns(['one text']);
    chapters = [
      {
        title: '60 : Pierre avec les webf',
        imgLink: '../assets/toto.jpg',
        text: ['some text'],
      }, {
        title: '61 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: ['some text'],
      }, {
        title: '62 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: ['some text'],
      },
    ];
    photos = [
      { imgLink: 'url/photo1' },
      { imgLink: 'url/photo2' },
    ];
    sinon.stub(photosApi, 'fetch').resolves(photos);
    sinon.stub(chaptersApi, 'fetch').resolves({ title, chapters });
    const Constructor = Vue.extend(ArticlePage);
    let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue, router })
    component.$route.params.id = idArticle;
  });

  afterEach(() => {
    chaptersApi.fetch.restore();
    photosApi.fetch.restore();
    translationsService.getChapterTitle.restore();
    translationsService.getChapterText.restore();
  });

  it('should be named "ArticlePage"', () => {
    expect(wrapper.name()).toEqual('ArticlePage');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('mounted', () => {
    it('should call chapters api to fetch chapters', () => {
      expect(chaptersApi.fetch).toHaveBeenCalledWith(idArticle);
    });

    it('should call photos api to fetch photos', () => {
      expect(photosApi.fetch).toHaveBeenCalledWith(idArticle);
    });

    it('should save chapters from api in data chapters', () => Vue.nextTick().then(() => {
      expect(wrapper.vm.chapters).toEqual(chapters);
    }));

    it('should save photos from api in data photos', () => Vue.nextTick().then(() => {
      expect(wrapper.vm.photos).toEqual(photos);
    }));
  });

  describe('render', () => {
    it('should render as many chapters as received from the API', () => Vue.nextTick().then(() => {
      const chaptersCards = wrapper.findAll('.chapter-card');
      expect(chaptersCards.length).toEqual(3);
    }));

    it('should have empty chapters in data chapters', () => {
      expect(wrapper.vm.chapters).toEqual([]);
    });

    it('should have empty photos in data photos', () => {
      expect(wrapper.vm.photos).toEqual([]);
    });
  });

  describe('locales', () => {
    const languages = Object.keys(ArticlePage.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticlePage.i18n.messages.fr);

        it('contains 4 locales', () => {
          expect(locales.length).toEqual(4);
          expect(locales).toEqual([
            'hereTheGallery',
            'goToPreviousArticle',
            'goToNextArticle',
            'goToHomePage',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ArticlePage.i18n.messages.en);

        it('contains 4 locales', () => {
          expect(locales.length).toEqual(4);
          expect(locales).toEqual([
            'hereTheGallery',
            'goToPreviousArticle',
            'goToNextArticle',
            'goToHomePage',
          ]);
        });
      });
    });
  });
});
