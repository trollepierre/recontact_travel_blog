import Vue from 'vue';
import PhotoCard from '@/components/PhotoCard';

describe('PhotoCard.vue', () => {
  let component;
  let photo;

  beforeEach(() => {
    photo = {
      imgLink: 'webf',
      dropboxId: '45',
    };
    const Constructor = Vue.extend(PhotoCard);
    component = new Constructor({
      propsData: {
        photo,
      },
    }).$mount();
  });

  it('should be named "PhotoCard"', () => {
    expect(component.$options.name).to.equal('PhotoCard');
  });

  describe('render', () => {
    it('should render photo image', () => Vue.nextTick().then(() => {
      const photoLink = component.$el.querySelector('img');
      expect(photoLink.getAttribute('src')).to.equal('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      expect(photoLink.getAttribute('lazy')).to.equal('loading');
    }));

    // Comment tester le lazy load ?
    it.skip('should render photo image', () => Vue.nextTick().then(() => {
      const photoLink = component.$el.querySelector('img');

      // return Vue.nextTick().then(() => {
      // console.log(photoLink);
      expect(photoLink.getAttribute('lazy')).to.equal('loaded');
      expect(photoLink.getAttribute('src')).to.contain('webf');
      // });
    }));
  });

  describe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {
      // Given
      photo.imgLink = 'dropbox.com/img0.jpg';

      // When
      const imgLink = component.imgLink;

      // Then
      expect(imgLink).to.equal('dropbox.com/img0.jpg');
    });

    it('should return false when api status is undefined', () => {
      // Given
      photo.imgLink = '';

      // When
      const imgLink = component.imgLink;

      // Then
      expect(imgLink).to.equal(false);
    });
  });
});
