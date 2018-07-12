import Vue from 'vue';
import PhotoCard from './PhotoCard';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import VueLazyload from 'vue-lazyload';

describe('Component | PhotoCard.vue', () => {
  let wrapper
  let photo;
  let localVue;

  beforeEach(() => {
    photo = {
      imgLink: 'webf',
      dropboxId: '45',
    };
    localVue = createLocalVue();
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueLazyload)
    const propsData = { photo };
    wrapper = shallowMount(PhotoCard, { localVue, propsData })
  });

  it('should be named "PhotoCard"', () => {
    expect(wrapper.name()).toEqual('PhotoCard');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  xdescribe('render', () => {
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

  xdescribe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {

      photo.imgLink = 'dropbox.com/img0.jpg';


      const { imgLink } = component;


      expect(imgLink).toEqual('dropbox.com/img0.jpg');
    });

    it('should return false when api status is undefined', () => {

      photo.imgLink = '';


      const { imgLink } = component;


      expect(imgLink).toEqual(false);
    });
  });
});
