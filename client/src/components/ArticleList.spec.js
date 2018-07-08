import Vue from 'vue';
import router from '../router/router';
import articlesApi from '../api/articles';
import ArticleList from './ArticleList';
import syncApi from '../api/sync';
import positionsApi from '../api/positions';
import notificationsService from '../services/notifications';
import articlesSorter from '../services/articlesSorter';

xdescribe('Component | ArticleList.vue', () => {
  let component;

  const article = (dropboxId = 59) => ({
    dropboxId,
    frTitle: 'Le titre',
    enTitle: 'The title',
  });

  const fetchArticles = [article('92'), article('12')];
  const sortedArticles = [article('12'), article('92')];

  beforeEach(() => {
    sinon.stub(articlesSorter, 'sortByDropboxId').returns(sortedArticles);
    sinon.stub(articlesApi, 'fetchAll').resolves(fetchArticles);
    const Constructor = Vue.extend(ArticleList);
    component = new Constructor(({
      router,
      propsData: {
        adminMode: true,
      },
    })).$mount();
  });

  afterEach(() => {
    articlesSorter.sortByDropboxId.restore();
    articlesApi.fetchAll.restore();
  });

  it('should be named "ArticleList"', () => {
    expect(component.$options.name).toEqual('ArticleList');
  });

  describe('mounted', () => {
    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith();
    });

    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith();
    });

    it('should save articles from api in data articles', () => Vue.nextTick().then(() => {
      expect(component.$data.articles).toEqual(sortedArticles);
    }));
  });

  describe('render', () => {
    it('should render as many articles as received from the API', () => Vue.nextTick().then(() => {
      const articleCards = component.$el.querySelectorAll('.article-card');
      expect(articleCards.length).toEqual(2);
    }));

    it('should render correct title', () => {
      const articleCards = component.$el.querySelector('.article-results__title');
      expect(articleCards.innerText).toEqual('fixWebsite');
    });

    it('should display a button to synchronise', () => {
      const buttonToSync = component.$el.querySelectorAll('button.article-results__buttons')[1];
      expect(buttonToSync).to.exist;
      expect(buttonToSync.innerText).toEqual('getNewArticles');
    });
  });

  describe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = true;

      // When
      const { title } = component;

      // Then
      expect(title).toEqual('fixWebsite');
    });

    it('should return "Les articles du voyage" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = false;

      // When
      const { title } = component;

      // Then
      expect(title).toEqual('theArticlesOfTheTrip');
    });
  });

  describe('#updateLastPosition', () => {
    beforeEach(() => {
      // given
      sinon.stub(positionsApi, 'add');
    });

    afterEach(() => {
      positionsApi.add.restore();
    });

    it('should call positionsApi to add default position', () => {
      // given
      positionsApi.add.resolves({});
      const position = {
        place: null,
        time: null,
      };

      // when
      component.updateLastPosition();

      // then
      return Vue.nextTick().then(() => {
        expect(positionsApi.add).toHaveBeenCalledWith(position);
      });
    });

    it('should updateLastPositionData with api answer', () => {
      // given
      positionsApi.add.resolves({
        place: 'London',
        time: '6 May 2018',
      });

      // when
      component.updateLastPosition();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$data.lastPosition).toEqual('London, 6 May 2018');
      });
    });
  });

  describe('#synchronise', () => {
    beforeEach(() => {
      // given
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
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      const message = 'syncLaunched';
      expect(notificationsService.information).toHaveBeenCalledWithExactly(component, message);
    });

    it('should call syncApi', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(syncApi.launch).toHaveBeenCalledWith();
      });
    });

    it('should display success toast notification when synchronisation succeeds', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(notificationsService.removeInformation).toHaveBeenCalledWithExactly(component);
        const message = 'syncDone';
        expect(notificationsService.success).toHaveBeenCalledWithExactly(component, message);
      });
    });

    it('should redirect to /', () => {
      // given
      sinon.stub(component.$router, 'push').resolves({});
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$router.push).toHaveBeenCalledWith('/');
        // after
        component.$router.push.restore();
      });
    });

    it('should display error toast notification when synchronisation fails', () => {
      // given
      syncApi.launch.rejects(new Error('Expected error'));

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(notificationsService.removeInformation).toHaveBeenCalledWithExactly(component);
        const message = 'syncError Error: Expected error';
        expect(notificationsService.error).toHaveBeenCalledWithExactly(component, message);
      });
    });
  });

  describe('clicking on button "Synchronise"', () => {
    let stub;
    let syncButton;

    beforeEach(() => {
      stub = sinon.stub(notificationsService, 'information');
      [, syncButton] = component.$el.querySelectorAll('button.article-results__buttons');
    });

    afterEach(() => {
      notificationsService.information.restore();
    });

    it('should disable sync button', () => {
      // when
      stub.rejects();
      syncButton.click();

      // then
      return Vue.nextTick().then(() => {
        expect(syncButton.disabled).to.be.true;
      });
    });

    it('should call synchronise api', () => {
      // given
      stub.resolves({});
      sinon.stub(component, 'synchronise').resolves({});

      // when
      syncButton.click();

      // then
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
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleList.i18n.messages.fr);

        it('contains 15 locales', () => {
          expect(locales.length).toEqual(15);
          expect(locales).to.deep.equal([
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
          expect(locales).to.deep.equal([
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
