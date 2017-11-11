import Vue from 'vue';
import VueRouter from 'vue-router';
import router from '@/router';
import articlesApi from '@/api/articles';
import ArticleList from '@/components/ArticleList';
import syncApi from '@/api/sync';
import notificationsService from '@/services/notifications';

Vue.use(VueRouter);

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
      expect(articleCards.innerText).to.equal('Administrer le site');
    });

    it('should display a button to synchronise', () => {
      const buttonToSync = component.$el.querySelector('button.article-results__sync');
      expect(buttonToSync).to.exist;
      expect(buttonToSync.innerText).to.equal('Récupérer les nouveaux articles');
    });
  });

  describe('computed property #title', () => {
    it('should return "Administrer le site" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = true;

      // When
      const title = component.title;

      // Then
      expect(title).to.equal('Administrer le site');
    });

    it('should return "Les articles du voyage" when site is in adminMode', () => {
      // Given
      component.$props.adminMode = false;

      // When
      const title = component.title;

      // Then
      expect(title).to.equal('Les articles du voyage');
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
      const message = 'La synchronisation est lancée ! Patientez quelques secondes...';
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
        const message = 'La synchronisation s\'est effectuée sans problème !';
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
        const message = 'Erreur : Problème durant la synchronisation : Expected error';
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
});
