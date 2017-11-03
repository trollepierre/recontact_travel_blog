import Vue from 'vue';
import ArticleCard from '@/components/ArticleCard';
import VueRouter from 'vue-router';
import router from '@/router';
import notificationService from '@/services/notification';
import deleteArticleApi from '@/api/deleteArticle';

Vue.use(VueRouter);

describe('ArticleCard.vue', () => {
  describe('when adminMode is not defined', () => {
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
        },
      }).$mount();
    });

    it('should be named "ArticleCard"', () => {
      expect(component.$options.name).to.equal('ArticleCard');
    });

    describe('$data', () => {
      it('should have isDeleteClicked property set to false', () => {
        expect(component.$data.isDeleteClicked).to.be.false;
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
        expect(dropboxLink.getAttribute('href')).to.equal('http://dropbox.com');
        expect(dropboxLink.getAttribute('target')).to.equal('_blank');
      });

      it('should have enabled article button', () => {
        expect(component.$el.querySelector('.article__view-button').disabled).to.be.false;
      });

      it('should have enabled dropbox button', () => {
        expect(component.$el.querySelector('.article__dropbox-button').disabled).to.be.false;
      });
    });

    describe('disableDeleteButton', () => {
      it('should set isDeleteClicked to true', () => {
        // when
        component.disableDeleteButton();

        // then
        expect(component.$data.isDeleteClicked).to.be.true;
      });
    });

    describe('viewArticle', () => {
      it('should redirect to /articles/:articleId', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});

        // when
        component.viewArticle('58');

        // then
        expect(component.$router.push).to.have.been.calledWith('/articles/58');

        // after
        component.$router.push.restore();
      });
    });

    describe('goToArticle', () => {
      it('should redirect to /articles/:articleId', () => {
        // given
        sinon.stub(component.$router, 'push').resolves({});

        // when
        component.goToArticle('58');

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

    describe('deleteArticle', () => {
      beforeEach(() => {
        // given
        sinon.stub(deleteArticleApi, 'deleteArticle');
        sinon.stub(notificationService, 'success').resolves({});
        sinon.stub(notificationService, 'error').resolves({});
      });

      afterEach(() => {
        deleteArticleApi.deleteArticle.restore();
        notificationService.success.restore();
        notificationService.error.restore();
      });

      it('should set isDeleteClicked to true', () => {
        // given
        deleteArticleApi.deleteArticle.resolves({});

        // when
        component.deleteArticle('58');

        // then
        expect(component.$data.isDeleteClicked).to.be.true;
      });

      it('should call delete article api', () => {
        // given
        deleteArticleApi.deleteArticle.resolves({});

        // when
        component.deleteArticle('58');

        // then
        expect(deleteArticleApi.deleteArticle).to.have.been.calledWith();
      });

      it('should display success toast notification when delete succeeds', () => {
        // given
        deleteArticleApi.deleteArticle.resolves({});

        // when
        component.deleteArticle('58');

        // then
        return Vue.nextTick().then(() => {
          const message = 'La suppression s\'est effectuée sans problème !';
          expect(notificationService.success).to.have.been.calledWithExactly(component, message);
        });
      });

      it('should display error toast notification when delete fails', () => {
        // given
        deleteArticleApi.deleteArticle.rejects(new Error('Expected error'));

        // when
        component.deleteArticle('58');

        // then
        return Vue.nextTick().then(() => {
          const message = 'Erreur : Problème durant la suppression : Expected error';
          expect(notificationService.error).to.have.been.calledWithExactly(component, message);
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
        sinon.stub(deleteArticleApi, 'deleteArticle').resolves({});
        sinon.stub(notificationService, 'success').resolves({});
        sinon.stub(notificationService, 'error').resolves({});
      });

      afterEach(() => {
        deleteArticleApi.deleteArticle.restore();
        notificationService.success.restore();
        notificationService.error.restore();
      });

      it('should disable button', () => {
        // when
        component.$el.querySelector('button.article__delete-button').click();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$el.querySelector('.article__delete-button').disabled).to.be.true;
        });
      });

      it('should call deleteArticleApi', () => {
        // when
        component.$el.querySelector('button.article__delete-button').click();

        // then
        expect(deleteArticleApi.deleteArticle).to.have.been.calledWith('58');
      });
    });
  });
});
