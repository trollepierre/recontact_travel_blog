import Vue from 'vue';
import router from '@/router';
import articlesApi from '@/api/articles';
import ArticleList from '@/components/ArticleList';
import syncApi from '@/api/sync';
import notificationsService from '@/services/notifications';
import articlesSorter from '@/services/articlesSorter';

describe('ArticleList.vue', () => {
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
    expect(component.$options.name).to.equal('ArticleList');
  });

  describe('mounted', () => {
    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).to.have.been.calledWith();
    });

    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).to.have.been.calledWith();
    });

    it('should save articles from api in data articles', () => Vue.nextTick().then(() => {
      expect(component.$data.articles).to.equal(sortedArticles);
    }));
  });

  describe('render', () => {
    it('should render as many articles as received from the API', () => Vue.nextTick().then(() => {
      const articleCards = component.$el.querySelectorAll('.article-card');
      expect(articleCards.length).to.equal(2);
    }));

    it('should render correct title', () => {
      const articleCards = component.$el.querySelector('.article-results__title');
      expect(articleCards.innerText).to.equal('fixWebsite');
    });

    it('should display a button to synchronise', () => {
      const buttonToSync = component.$el.querySelectorAll('button.article-results__sync')[1];
      expect(buttonToSync).to.exist;
      expect(buttonToSync.innerText).to.equal('getNewArticles');
    });
  });

  describe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = true;

      // When
      const { title } = component;

      // Then
      expect(title).to.equal('fixWebsite');
    });

    it('should return "Les articles du voyage" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = false;

      // When
      const { title } = component;

      // Then
      expect(title).to.equal('theArticlesOfTheTrip');
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
      expect(notificationsService.information).to.have.been.calledWithExactly(component, message);
    });

    it('should call syncApi', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(syncApi.launch).to.have.been.calledWith();
      });
    });

    it('should display success toast notification when synchronisation succeeds', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(notificationsService.removeInformation).to.have.been.calledWithExactly(component);
        const message = 'syncDone';
        expect(notificationsService.success).to.have.been.calledWithExactly(component, message);
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
        expect(component.$router.push).to.have.been.calledWith('/');
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
        expect(notificationsService.removeInformation).to.have.been.calledWithExactly(component);
        const message = 'syncError Error: Expected error';
        expect(notificationsService.error).to.have.been.calledWithExactly(component, message);
      });
    });
  });

  describe('clicking on button "Synchronise"', () => {
    let stub;
    let syncButton;

    beforeEach(() => {
      stub = sinon.stub(notificationsService, 'information');
      syncButton = component.$el.querySelectorAll('button.article-results__sync')[1];
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
        expect(component.synchronise).to.have.been.called;

        // after
        component.synchronise.restore();
      });
    });
  });

  describe('locales', () => {
    const languages = Object.keys(ArticleList.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).to.equal(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleList.i18n.messages.fr);

        it('contains 9 locales', () => {
          expect(locales.length).to.equal(9);
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
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ArticleList.i18n.messages.en);

        it('contains 9 locales', () => {
          expect(locales.length).to.equal(9);
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
          ]);
        });
      });
    });
  });
});
