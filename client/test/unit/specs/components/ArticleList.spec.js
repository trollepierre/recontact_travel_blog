import Vue from 'vue';
import router from '@/router';
import articlesApi from '@/api/articles';
import ArticleList from '@/components/ArticleList';
import syncApi from '@/api/sync';
import notificationsService from '@/services/notifications';

describe('ArticleList.vue', () => {
  let component;
  let articles;

  beforeEach(() => {
    articles = [
      {
        name: '60 : Pierre avec les webf',
        imgLink: '../assets/toto.jpg',
      }, {
        name: '61 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
      }, {
        name: '62 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
      },
    ];
    sinon.stub(articlesApi, 'fetchAll').resolves(articles);
    const Constructor = Vue.extend(ArticleList);
    component = new Constructor(({
      router,
      propsData: {
        adminMode: true,
      },
    })).$mount();
  });

  afterEach(() => {
    articlesApi.fetchAll.restore();
  });

  it('should be named "ArticleList"', () => {
    expect(component.$options.name).to.equal('ArticleList');
  });

  describe('mounted', () => {
    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).to.have.been.calledWith();
    });

    it('should save articles from api in data articles', () => Vue.nextTick().then(() => {
      expect(component.$data.articles).to.equal(articles);
    }));
  });

  describe('render', () => {
    it('should render as many articles as received from the API', () => Vue.nextTick().then(() => {
      const articleCards = component.$el.querySelectorAll('.article-card');
      expect(articleCards.length).to.equal(3);
    }));

    it('should render correct title', () => {
      const articleCards = component.$el.querySelector('.article-results__title');
      expect(articleCards.innerText).to.equal('fixWebsite');
    });

    it('should display a button to synchronise', () => {
      const buttonToSync = component.$el.querySelector('button.article-results__sync');
      expect(buttonToSync).to.exist;
      expect(buttonToSync.innerText).to.equal('getNewArticles');
    });
  });

  describe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = true;

      // When
      const title = component.title;

      // Then
      expect(title).to.equal('fixWebsite');
    });

    it('should return "Les articles du voyage" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = false;

      // When
      const title = component.title;

      // Then
      expect(title).to.equal('theArticlesOfTheTrip');
    });
  });

  describe('#synchronise', () => {
    beforeEach(() => {
      // given
      sinon.stub(syncApi, 'launch');
      sinon.stub(notificationsService, 'success').resolves({});
      sinon.stub(notificationsService, 'error').resolves({});
    });

    afterEach(() => {
      syncApi.launch.restore();
      notificationsService.success.restore();
      notificationsService.error.restore();
    });

    it('should display success toast notification before synchronisation calls', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      const message = 'syncLaunched';
      expect(notificationsService.success).to.have.been.calledWithExactly(component, message);
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
        const message = 'syncError Error: Expected error';
        expect(notificationsService.error).to.have.been.calledWithExactly(component, message);
      });
    });
  });

  describe('clicking on button "Synchronise"', () => {
    beforeEach(() => {
      sinon.stub(notificationsService, 'success').resolves({});
    });

    afterEach(() => {
      notificationsService.success.restore();
    });

    it('should disable button', () => {
      // when
      component.$el.querySelector('button.article-results__sync').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('button.article-results__sync').disabled).to.be.true;
      });
    });

    it('should call synchronise api', () => {
      // given
      sinon.stub(component, 'synchronise').resolves({});

      // when
      component.$el.querySelector('button.article-results__sync').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.synchronise).to.have.been.called;

        // after
        component.synchronise.restore();
      });
    });
  });

  describe('locales', () => {
    const langages = Object.keys(ArticleList.i18n.messages);

    it('contains 2 langages', () => {
      expect(langages.length).to.equal(2);
      expect(langages).to.deep.equal(['fr', 'en']);
    });

    context('each langage', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleList.i18n.messages.fr);

        it('contains 6 locales', () => {
          expect(locales.length).to.equal(6);
          expect(locales).to.deep.equal([
            'getNewArticles',
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

        it('contains 6 locales', () => {
          expect(locales.length).to.equal(6);
          expect(locales).to.deep.equal([
            'getNewArticles',
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
