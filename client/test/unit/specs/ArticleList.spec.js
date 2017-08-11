import Vue from 'vue';
import axios from 'axios';
import ArticleList from '@/components/ArticleList';

describe('ArticleList.vue', () => {
  let component;

  beforeEach(() => {
    const response = {
      data: [
        {
          name: '58 : Pierre avec les webf',
          imgLink: '../assets/webf.jpg',
        }, {
          name: '59 : Pierre au Koezio',
          imgLink: '/assets/koezio.jpg',
        },
      ],
    };
    sinon.stub(axios, 'get').resolves(response);
    const Constructor = Vue.extend(ArticleList);
    component = new Constructor().$mount();
  });

  afterEach(() => {
    axios.get.restore();
  });

  it('should be named "ArticleList"', () => {
    expect(component.$options.name).to.equal('ArticleList');
  });

  describe('mounted', () => {
    it('should call axios get', () => {
      const options = { headers: { 'Content-Type': 'application/json' } };
      const url = `${process.env.PORT}/articles`;
      expect(axios.get).to.have.been.calledWith(url, options);
    });
  });

  describe('render', () => {
    it('should render as many articles as received from the API', () => {
      const articleCards = component.$el.querySelectorAll('.article-card');
      expect(articleCards.length).to.equal(2);
    });
  });
});
