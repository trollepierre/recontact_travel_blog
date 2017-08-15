import Vue from 'vue';
import paragraphsApi from '@/api/paragraphs';
import ArticlePage from '@/components/ArticlePage';

describe('ArticlePage.vue', () => {
  let component;
  let paragraphs;

  beforeEach(() => {
    paragraphs = [
      {
        title: '60 : Pierre avec les webf',
        imgLink: '../assets/toto.jpg',
        text: 'some text',
      }, {
        title: '61 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: 'some text',
      }, {
        title: '62 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: 'some text',
      },
    ];
    sinon.stub(paragraphsApi, 'fetchAll').resolves(paragraphs);
    const Constructor = Vue.extend(ArticlePage);
    component = new Constructor().$mount();
  });

  afterEach(() => {
    paragraphsApi.fetchAll.restore();
  });

  it('should be named "ArticlePage"', () => {
    expect(component.$options.name).to.equal('ArticlePage');
  });

  describe('mounted', () => {
    it('should call paragraphs api to fetch paragraphs', () => {
      expect(paragraphsApi.fetchAll).to.have.been.calledWith();
    });

    it('should saved paragraphs from api in data paragraphs', () => Vue.nextTick().then(() => {
      expect(component.$data.paragraphs).to.equal(paragraphs);
    }));
  });

  describe('render', () => {
    it('should render as many paragraphs as received from the API', () => Vue.nextTick().then(() => {
      const paragraphCards = component.$el.querySelectorAll('.paragraph-card');
      expect(paragraphCards.length).to.equal(3);
    }));
  });
});
