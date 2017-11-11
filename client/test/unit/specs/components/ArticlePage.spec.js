import Vue from 'vue';
import router from '@/router';
import photosApi from '@/api/photos';
import chaptersApi from '@/api/chapters';
import ArticlePage from '@/components/ArticlePage';

describe('ArticlePage.vue', () => {
  let component;
  let chapters;
  let photos;
  const idArticle = 8;

  beforeEach(() => {
    chapters = [
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
    photos = [
      { imgLink: 'url/photo1' },
      { imgLink: 'url/photo2' },
    ];
    sinon.stub(photosApi, 'fetch').resolves(photos);
    sinon.stub(chaptersApi, 'fetch').resolves(chapters);
    const Constructor = Vue.extend(ArticlePage);
    component = new Constructor({ router }).$mount();
    component.$route.params.id = idArticle;
  });

  afterEach(() => {
    chaptersApi.fetch.restore();
    photosApi.fetch.restore();
  });

  it('should be named "ArticlePage"', () => {
    expect(component.$options.name).to.equal('ArticlePage');
  });

  describe('mounted', () => {
    it('should call chapters api to fetch chapters', () => {
      expect(chaptersApi.fetch).to.have.been.calledWith(idArticle);
    });

    it('should call photos api to fetch photos after 5s', () => {
      expect(photosApi.fetch).to.have.been.calledWith(idArticle);
    });

    it('should saved chapters from api in data chapters', () => Vue.nextTick().then(() => {
      expect(component.$data.chapters).to.equal(chapters);
    }));

    it('should saved photos from api in data photos', () => Vue.nextTick().then(() => {
      expect(component.$data.photos).to.equal(photos);
    }));
  });

  describe('render', () => {
    it('should render as many chapters as received from the API', () => Vue.nextTick().then(() => {
      const chaptersCards = component.$el.querySelectorAll('.chapter-card');
      expect(chaptersCards.length).to.equal(3);
    }));
  });
});
