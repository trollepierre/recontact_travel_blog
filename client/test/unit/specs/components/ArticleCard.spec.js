import Vue from 'vue';
import ArticleCard from '@/components/ArticleCard';

describe('ArticleCard.vue', () => {
  let component;
  let article;

  beforeEach(() => {
    article = {
      name: '58 : Pierre avec les webf',
      imgLink: 'webf',
    };
    const Constructor = Vue.extend(ArticleCard);
    component = new Constructor({
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
      expect(articleTitle.textContent).to.equal('58 : Pierre avec les webf');
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

  describe('clicking on button "Voir l\'article"', () => {
    it('should disable button', () => {
      // when
      component.$el.querySelector('button.article__view-button').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.article__view-button').disabled).to.be.true;
      });
    });

    it.skip('should redirect to /article/id', () => {
      // given
      sinon.stub(component, '$router').resolves({});

      // when
      component.$el.querySelector('button.article__view-button').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$router).to.have.been.calledWith('/article/58');
      });
    });
  });
});
