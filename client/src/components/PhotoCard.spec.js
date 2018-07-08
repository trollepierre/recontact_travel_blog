import Vue from 'vue';
import PhotoCard from './PhotoCard';

xdescribe('Component | PhotoCard.vue', () => {
  let wrapper
  let photo;

  beforeEach(() => {
    photo = {
      imgLink: 'webf',
      dropboxId: '45',
    };
    const Constructor = Vue.extend(PhotoCard);
    let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue,
      propsData: {
        photo,
      },
    })
  });

  it('should be named "PhotoCard"', () => {
    expect(wrapper.name()).toEqual('PhotoCard');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('render', () => {
    it('should render photo image', () => Vue.nextTick().then(() => {
      const photoLink = wrapper.find('img');
      expect(photoLink.getAttribute('src')).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      expect(photoLink.getAttribute('lazy')).toEqual('loading');
    }));

    // Comment tester le lazy load ?
    it.skip('should render photo image', () => Vue.nextTick().then(() => {
      const photoLink = wrapper.find('img');

      // return Vue.nextTick().then(() => {
      // console.log(photoLink);
      expect(photoLink.getAttribute('lazy')).toEqual('loaded');
      expect(photoLink.getAttribute('src')).toContain('webf');
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
