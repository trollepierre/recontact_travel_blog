import Vue from 'vue';
import ArticleCard from '@/components/ArticleCard';

describe('ArticleCard.vue', () => {
  let component;

  beforeEach(() => {
    const article = {
      name: '58 : Pierre avec les webf',
      imgLink: '../assets/webf.jpg',
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
      expect(component.$data.isClicked).to.equal(false);
    });
  });

  describe('render', () => {
    it('should render article title', () => {
      const articleTitle = component.$el.querySelector('.article__title');
      expect(articleTitle.textContent).to.equal('58 : Pierre avec les webf');
    });
  });

  describe('on click on button "voir les photos"', () => {
    it('should disable button');

    it('should open target blank to dropbox');
  });
});
