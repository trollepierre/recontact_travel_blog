import Vue from 'vue';
import ArticleCard from '@/components/ArticleCard';
import VueRouter from 'vue-router';
import router from '@/router';
import notificationsService from '@/services/notifications';
import articlesApi from '@/api/articles';

Vue.use(VueRouter);

describe('ArticleCard.vue', () => {
  describe('when adminMode is not defined', () => {
    const galleryLink = 'https://www.dropbox.com/sh/k79oskpopi9lm8v/AABst0JslmKYw3Rhx9BjwJxMa?dl=0';
    let component;
    let article;

    beforeEach(() => {
      article = {
        dropboxId: '58',
        imgLink: 'webf',
        galleryLink,
      };
      const Constructor = Vue.extend(ArticleCard);
      component = new Constructor({
        router,
        propsData: {
          article,
        },
      }).$mount();
    });

    it('should be named "ArticleCard"', () => {
      expect(component.$options.name).to.equal('ArticleCard');
    });

    describe('$data', () => {
      it('should have isUpdateClicked property set to false', () => {
        expect(component.$data.isUpdateClicked).to.be.false;
      });
    });

    describe('computed property #articleUrl', () => {
      it('should return /articles/:id', () => {
        // When
        const articleUrl = component.articleUrl;

        // Then
        expect(articleUrl).to.equal('/articles/58');
      });
    });

    describe('clicking on title', () => {
      it('should redirect to /article/id', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});

        // when
        component.$el.querySelector('.article__header a').click();

        // then
        expect(component.$router.push).to.have.been.calledWith('/articles/58');

        // after
        component.$router.push.restore();
      });
    });

    describe('render', () => {
      it('should render article title', () => {
        const articleTitle = component.$el.querySelector('.article__title');
        expect(articleTitle.textContent).to.equal('58');
      });

      it('should render article image', () => {
        const articleLink = component.$el.querySelector('img');
        expect(articleLink.getAttribute('src')).to.contain('webf');
      });

      it('should render dropbox gallery link', () => {
        const dropboxLink = component.$el.querySelector('a.article__dropbox');
        expect(dropboxLink.getAttribute('href')).to.equal(galleryLink);
        expect(dropboxLink.getAttribute('target')).to.equal('_blank');
      });

      it('should have enabled article button', () => {
        expect(component.$el.querySelector('.article__view-button').disabled).to.be.false;
      });

      it('should have enabled dropbox button', () => {
        expect(component.$el.querySelector('.article__dropbox-button').disabled).to.be.false;
      });
    });

    describe('#disableDeleteButton', () => {
      it('should set isUpdateClicked to true', () => {
        // when
        component.disableDeleteButton();

        // then
        expect(component.$data.isUpdateClicked).to.be.true;
      });
    });

    describe('#viewArticle', () => {
      it('should redirect to /articles/:articleId', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});

        // when
        component.viewArticle();

        // then
        expect(component.$router.push).to.have.been.calledWith('/articles/58');

        // after
        component.$router.push.restore();
      });
    });

    describe('#goToArticle', () => {
      it('should redirect to /articles/:articleId', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});

        // when
        component.goToArticle();

        // then
        expect(component.$router.push).to.have.been.calledWith('/articles/58');

        // after
        component.$router.push.restore();
      });
    });

    describe('clicking on button "Voir l\'article"', () => {
      it('should redirect to /article/id', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});

        // when
        component.$el.querySelector('button.article__view-button').click();

        // then
        expect(component.$router.push).to.have.been.calledWith('/articles/58');
        // after
        component.$router.push.restore();
      });
    });

    describe('#update', () => {
      beforeEach(() => {
        // given
        sinon.stub(articlesApi, 'update');
        sinon.stub(notificationsService, 'success').resolves({});
        sinon.stub(notificationsService, 'error').resolves({});
      });

      afterEach(() => {
        articlesApi.update.restore();
        notificationsService.success.restore();
        notificationsService.error.restore();
      });

      it('should set isUpdateClicked to true', () => {
        // given
        articlesApi.update.resolves({});

        // when
        component.updateArticle();

        // then
        expect(component.$data.isUpdateClicked).to.be.true;
      });

      it('should call delete article api', () => {
        // given
        articlesApi.update.resolves({});

        // when
        component.updateArticle();

        // then
        expect(articlesApi.update).to.have.been.calledWith();
      });

      it('should display success toast notification before synchronisation calls', () => {
        // given
        articlesApi.update.resolves({});

        // when
        component.updateArticle();

        // then
        const message = 'La synchronisation est lancée ! Patientez quelques secondes...';
        expect(notificationsService.success).to.have.been.calledWithExactly(component, message);
      });

      it('should redirect to /article/id', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});
        articlesApi.update.resolves({});

        // when
        component.updateArticle();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$router.push).to.have.been.calledWith('/articles/58');
          // after
          component.$router.push.restore();
        });
      });

      it('should display error toast notification when synchronisation fails', () => {
        // given
        articlesApi.update.rejects(new Error('Expected error'));

        // when
        component.updateArticle();

        // then
        return Vue.nextTick().then(() => {
          const message = 'Erreur : Problème durant la synchronisation : Expected error';
          expect(notificationsService.error).to.have.been.calledWithExactly(component, message);
        });
      });
    });
  });

  describe('when adminMode is true', () => {
    let component;
    let article;

    beforeEach(() => {
      article = {
        dropboxId: '58',
        imgLink: 'webf',
      };
      const Constructor = Vue.extend(ArticleCard);
      component = new Constructor({
        router,
        propsData: {
          article,
          adminMode: true,
        },
      }).$mount();
    });

    describe('clicking on button "supprimer l\'article"', () => {
      beforeEach(() => {
        // given
        sinon.stub(articlesApi, 'update').resolves({});
        sinon.stub(notificationsService, 'success').resolves({});
        sinon.stub(notificationsService, 'error').resolves({});
      });

      afterEach(() => {
        articlesApi.update.restore();
        notificationsService.success.restore();
        notificationsService.error.restore();
      });

      it('should disable button', () => {
        // when
        component.$el.querySelector('button.article__update-button').click();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$el.querySelector('.article__update-button').disabled).to.be.true;
        });
      });

      it('should call articlesApi', () => {
        // when
        component.$el.querySelector('button.article__update-button').click();

        // then
        expect(articlesApi.update).to.have.been.calledWith('58');
      });
    });
  });
});
