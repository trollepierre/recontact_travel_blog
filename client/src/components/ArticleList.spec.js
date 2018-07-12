import Vue from 'vue';
import articlesApi from '../api/articles';
import ArticleList from './ArticleList';
import syncApi from '../api/sync';
import positionsApi from '../api/positions';
import notificationsService from '../services/notifications';
import articlesSorter from '../services/articlesSorter';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

describe('Component | ArticleList.vue', () => {
  let localVue
  let wrapper
  const router = {
    init: jest.fn(),
    push: jest.fn(),
    history: {},
  }

  const article = (dropboxId = 59) => ({
    dropboxId,
    frTitle: 'Le titre',
    enTitle: 'The title',
  });

  const fetchArticles = [article('92'), article('12')];
  const sortedArticles = [article('12'), article('92')];

  beforeEach(() => {
    articlesSorter.sortByDropboxId = jest.fn()
    articlesSorter.sortByDropboxId.mockReturnValue(sortedArticles);
    articlesApi.fetchAll = jest.fn()
    articlesApi.fetchAll.mockResolvedValue(fetchArticles);
    const propsData = {
      adminMode: true,
    };
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    wrapper = shallowMount(ArticleList, { localVue, router, propsData })
  });

  it('should be named "ArticleList"', () => {
    expect(wrapper.name()).toEqual('ArticleList');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  xdescribe('mounted', () => {
    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith();
    });

    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith();
    });

    it('should save articles from api in data articles', () => Vue.nextTick().then(() => {
      expect(wrapper.vm.articles).toEqual(sortedArticles);
    }));
  });

  xdescribe('render', () => {
    it('should render as many articles as received from the API', () => Vue.nextTick().then(() => {
      const articleCards = wrapper.findAll('.article-card');
      expect(articleCards.length).toEqual(2);
    }));

    it('should render correct title', () => {
      const articleCards = wrapper.find('.article-results__title');
      expect(articleCards.innerText).toEqual('fixWebsite');
    });

    it('should display a button to synchronise', () => {
      const buttonToSync = wrapper.findAll('button.article-results__buttons')[1];
      expect(buttonToSync).to.exist;
      expect(buttonToSync.innerText).toEqual('getNewArticles');
    });
  });

  xdescribe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      component.$props.adminMode = true;

      const { title } = component;

      expect(title).toEqual('fixWebsite');
    });

    it('should return "Les articles du voyage" when site is in adminMode', () => {
      component.$props.adminMode = false;

      const { title } = component;

      expect(title).toEqual('theArticlesOfTheTrip');
    });
  });

  xdescribe('methods', () => {
    describe('#updateLastPosition', () => {
      beforeEach(() => {
        sinon.stub(positionsApi, 'add');
      });

      afterEach(() => {
        positionsApi.add.restore();
      });

      it('should call positionsApi to add default position', () => {
        positionsApi.add.resolves({});
        const position = {
          place: null,
          time: null,
        };

        component.updateLastPosition();

        return Vue.nextTick().then(() => {
          expect(positionsApi.add).toHaveBeenCalledWith(position);
        });
      });

      it('should updateLastPositionData with api answer', () => {
        positionsApi.add.resolves({
          place: 'London',
          time: '6 May 2018',
        });

        component.updateLastPosition();

        return Vue.nextTick().then(() => {
          expect(wrapper.vm.lastPosition).toEqual('London, 6 May 2018');
        });
      });
    });

    describe('#synchronise', () => {
      beforeEach(() => {
        sinon.stub(syncApi, 'launch');
        sinon.stub(notificationsService, 'success').resolves({});
        sinon.stub(notificationsService, 'information').resolves({});
        sinon.stub(notificationsService, 'removeInformation').resolves({});
        sinon.stub(notificationsService, 'error').resolves({});
      });

      afterEach(() => {
        syncApi.launch.restore();
        notificationsService.success.restore();
        notificationsService.information.restore();
        notificationsService.removeInformation.restore();
        notificationsService.error.restore();
      });

      it('should display success toast notification before synchronisation calls', () => {

        syncApi.launch.resolves({});


        component.synchronise();


        const message = 'syncLaunched';
        expect(notificationsService.information).toHaveBeenCalledWith(component, message);
      });

      it('should call syncApi', () => {

        syncApi.launch.resolves({});


        component.synchronise();


        return Vue.nextTick().then(() => {
          expect(syncApi.launch).toHaveBeenCalledWith();
        });
      });

      it('should display success toast notification when synchronisation succeeds', () => {

        syncApi.launch.resolves({});


        component.synchronise();


        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(component);
          const message = 'syncDone';
          expect(notificationsService.success).toHaveBeenCalledWith(component, message);
        });
      });

      it('should redirect to /', () => {

        sinon.stub(component.$router, 'push').resolves({});
        syncApi.launch.resolves({});


        component.synchronise();


        return Vue.nextTick().then(() => {
          expect(component.$router.push).toHaveBeenCalledWith('/');
          // after
          component.$router.push.restore();
        });
      });

      it('should display error toast notification when synchronisation fails', () => {

        syncApi.launch.rejects(new Error('Expected error'));


        component.synchronise();


        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(component);
          const message = 'syncError Error: Expected error';
          expect(notificationsService.error).toHaveBeenCalledWith(component, message);
        });
      });
    });
  })

  xdescribe('clicking on button "Synchronise"', () => {
    let stub;
    let syncButton;

    beforeEach(() => {
      stub = sinon.stub(notificationsService, 'information');
      [, syncButton] = wrapper.findAll('button.article-results__buttons');
    });

    afterEach(() => {
      notificationsService.information.restore();
    });

    it('should disable sync button', () => {

      stub.rejects();
      syncButton.click();


      return Vue.nextTick().then(() => {
        expect(syncButton.disabled).toEqual(true)
      });
    });

    it('should call synchronise api', () => {

      stub.resolves({});
      sinon.stub(component, 'synchronise').resolves({});


      syncButton.click();


      return Vue.nextTick().then(() => {
        expect(component.synchronise).toHaveBeenCalled;

        // after
        component.synchronise.restore();
      });
    });
  });

  describe('locales', () => {
    const languages = Object.keys(ArticleList.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleList.i18n.messages.fr);

        it('contains 15 locales', () => {
          expect(locales.length).toEqual(15);
          expect(locales).toEqual([
            'getNewArticles',
            'deleteAllArticles',
            'deleteAndSyncAllArticles',
            'getSubscribers',
            'fixWebsite',
            'theArticlesOfTheTrip',
            'syncLaunched',
            'syncDone',
            'syncError',
            'place',
            'time',
            'confirm',
            'lastPosition',
            'subtitle',
            'lastKnownPosition',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ArticleList.i18n.messages.en);

        it('contains 15 locales', () => {
          expect(locales.length).toEqual(15);
          expect(locales).toEqual([
            'getNewArticles',
            'deleteAllArticles',
            'deleteAndSyncAllArticles',
            'getSubscribers',
            'fixWebsite',
            'theArticlesOfTheTrip',
            'syncLaunched',
            'syncDone',
            'syncError',
            'place',
            'time',
            'confirm',
            'lastPosition',
            'subtitle',
            'lastKnownPosition',
          ]);
        });
      });
    });
  });
});
