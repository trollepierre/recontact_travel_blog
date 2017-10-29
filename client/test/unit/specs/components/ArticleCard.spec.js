import Vue from 'vue';
import ArticleCard from '@/components/ArticleCard';
import VueRouter from 'vue-router';
import router from '@/router';
Vue.use(VueRouter);

describe('ArticleCard.vue', () => {
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
    it('should have isClicked property set to false', () => {
      expect(component.$data.isClicked).to.be.false;
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

  describe('disableButton', () => {
    it('should set isClicked to true', () => {
      // when
      component.disableButton();

      // then
      expect(component.$data.isClicked).to.be.true;
    });
  });

  describe('viewArticle', () => {
    it('should set isClicked to true', () => {
      // when
      component.viewArticle('58');

      // then
      expect(component.$data.isClicked).to.be.true;
    });

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
    it('should disable button', () => {
      // when
      component.$el.querySelector('button.article__view-button').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.article__view-button').disabled).to.be.true;
      });
    });

    it('should redirect to /article/id', () => {
      // given
      sinon.stub(component.$router, 'push').resolves({});

      // when
      component.$el.querySelector('button.article__view-button').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$router.push).to.have.been.calledWith('/articles/58');
      });
    });
  });
});
