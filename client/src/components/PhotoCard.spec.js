import Vue from 'vue';
import PhotoCard from './PhotoCard';

xdescribe('PhotoCard.vue', () => {
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
    expect(component.$options.name).toEqual('PhotoCard');
  });

  describe('render', () => {
    it('should render photo image', () => Vue.nextTick().then(() => {
      const photoLink = component.$el.querySelector('img');
      expect(photoLink.getAttribute('src')).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      expect(photoLink.getAttribute('lazy')).toEqual('loading');
    }));

    // Comment tester le lazy load ?
    it.skip('should render photo image', () => Vue.nextTick().then(() => {
      const photoLink = component.$el.querySelector('img');

      // return Vue.nextTick().then(() => {
      // console.log(photoLink);
      expect(photoLink.getAttribute('lazy')).toEqual('loaded');
      expect(photoLink.getAttribute('src')).to.contain('webf');
      // });
    }));
  });

  describe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {
      // Given
      photo.imgLink = 'dropbox.com/img0.jpg';

      // When
      const { imgLink } = component;

      // Then
      expect(imgLink).toEqual('dropbox.com/img0.jpg');
    });

    it('should return false when api status is undefined', () => {
      // Given
      photo.imgLink = '';

      // When
      const { imgLink } = component;

      // Then
      expect(imgLink).toEqual(false);
    });
  });
});
