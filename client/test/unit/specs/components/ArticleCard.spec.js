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
    component = new Constructor({ props: { article } }).$mount();
  });

  it('should be named "ArticleCard"', () => {
    expect(component.$options.name).to.equal('ArticleCard');
  });

  describe('render', () => {
    // same issue than in JobBoard : JobCard.spec.js is skipped
    it.skip('should render article title', () => {
      console.log(component.$el);

      const articleTitle = component.$el.querySelector('.article__title');
      expect(articleTitle.textContent).to.equal('58 : Pierre avec les webf');
    });
  });

  describe('on click on button "voir les photos"', () => {

    it('should disable button');

    it('should open target blank to dropbox');

  });
});
