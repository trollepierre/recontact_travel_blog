import VueI18n from 'vue-i18n';
import VueModal from 'vue-js-modal';
import AppHeader from './AppHeader';

describe('Component | AppHeader.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
  });

  describe('template', () => {
    beforeEach(() => {
      wrapper = shallowMount(AppHeader, { localVue })
    })

    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should be named "AppHeader"', () => {
      expect(wrapper.name()).toEqual('AppHeader');
    });
  })

  describe('methods', () => {
    beforeEach(() => {
      wrapper = shallowMount(AppHeader, { localVue })
      localVue.use(VueModal)
    })

    describe('#displayFeedbackModal', () => {
      it('should display the feedback-modal', () => {
        wrapper.vm.$modal.show = jest.fn()

        wrapper.vm.displayFeedbackModal();

        expect(wrapper.vm.$modal.show).toHaveBeenCalledWith('feedback-modal');
      });
    });

    describe('#displaySubscribeModal', () => {
      it('should display the subscribe-modal', () => {
        wrapper.vm.$modal.show = jest.fn()

        wrapper.vm.displaySubscribeModal();

        expect(wrapper.vm.$modal.show).toHaveBeenCalledWith('subscribe-modal');
      });
    });
  });

  describe('events', () => {
    describe('clicking on button "Laisser un message"', () => {
      it('should call displayFeedbackModal', () => {
        wrapper.vm.displayFeedbackModal = jest.fn()

        wrapper.find('button.navbar-action.navbar-action__suggestion').trigger('click')

        expect(wrapper.vm.displayFeedbackModal).toHaveBeenCalled;
      });
    });

    describe('clicking on button "S\'abonner"', () => {
      it('should call displaySubscribeModal', () => {
        wrapper.vm.displaySubscribeModal = jest.fn()

        wrapper.find('button.navbar-action.navbar-action__subscribe').trigger('click')

        expect(wrapper.vm.displaySubscribeModal).toHaveBeenCalled;
      });
    });
  });

  describe('locales', () => {
    const languages = Object.keys(AppHeader.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(AppHeader.i18n.messages.fr);

        it('contains 5 locales', () => {
          expect(locales.length).toEqual(5);
          expect(locales).toEqual(['subscribe', 'suggestion', 'problem', 'tdm', 'home']);
        });
      });

      describe('en', () => {
        const locales = Object.keys(AppHeader.i18n.messages.en);

        it('contains 5 locales', () => {
          expect(locales.length).toEqual(5);
          expect(locales).toEqual(['subscribe', 'suggestion', 'problem', 'tdm', 'home']);
        });
      });
    });
  });
});
