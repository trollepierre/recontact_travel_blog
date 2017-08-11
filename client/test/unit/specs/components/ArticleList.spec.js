// todo minor: fix eslint issues
import Vue from 'vue';
import articlesApi from '@/api/articles';
import ArticleList from '@/components/ArticleList';

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
    component = new Constructor().$mount();
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

    it('should saved articles from api in data articles', () => Vue.nextTick().then(() => {
      expect(component.$data.articles).to.equal(articles);
    }));
  });

  describe('render', () => {
    it('should render as many articles as received from the API', () => Vue.nextTick().then(() => {
      const articleCards = component.$el.querySelectorAll('.article-card');
      expect(articleCards.length).to.equal(3);
    }));
  });
});
