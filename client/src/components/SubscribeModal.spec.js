import Vue from 'vue';
import SubscribeModal from './SubscribeModal';
import subscriptionsApi from '../api/subscriptions';
import notificationsService from '../services/notifications';

xdescribe('Component | SubscribeModal.vue', () => {
  let wrapper
  const email = 'pierre@recontact.me';

  beforeEach(() => {

    const Constructor = Vue.extend(SubscribeModal);


    let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue,
      data() {
        return {
          email,
        };
      },
    })
  });

  it('should be named "SubscribeModal"', () => {
    expect(wrapper.name()).toEqual('SubscribeModal');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('rendering', () => {
    it('should display the modal', () => {
      component.$modal.show('subscribe-modal');

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.subscribe-modal')).to.exist;
      });
    });
  });

  describe('#beforeOpen', () => {
    it('should reset email', () => {

      wrapper.vm.email = 'Coucou@contact.me';


      component.beforeOpen();


      expect(wrapper.vm.email).toEqual(null);
    });

    it('should remove error', () => {

      wrapper.vm.error = 'C\'est un problème';


      component.beforeOpen();


      expect(wrapper.vm.error).toEqual(null);
    });
  });

  describe('#opened', () => {
    beforeEach(() => {
      sinon.stub(component, '_focusOnInput');
      sinon.stub(component, '_closeModal');
    });

    afterEach(() => {
      component._focusOnInput.restore();
      component._closeModal.restore();
    });

    it('should focusOnInput', () => {

      component.opened();


      expect(component._focusOnInput).toHaveBeenCalledWith();
    });

    it('should close on escape key', () => {

      component.opened();


      const e = document.createEvent('Events');
      e.initEvent('keydown', true, true);
      e.keyCode = 27;
      document.dispatchEvent(e);

      return Vue.nextTick().then(() => {
        expect(component._closeModal).toHaveBeenCalledWith();
      });
    });

    it('should not close on any other key than space', () => {

      component.opened();


      const e = document.createEvent('Events');
      e.initEvent('keydown', true, true);
      e.keyCode = 13;
      document.dispatchEvent(e);

      return Vue.nextTick().then(() => {
        expect(component._closeModal).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('#_focusOnInput', () => {
    it.skip('should focus on input subscribe content', (done) => {

      component.$modal.show('subscribe-modal');


      setTimeout(() => {

        const inputSubscribe = wrapper.find('input#subscribe-content');
        expect(inputSubscribe).to.have.focus();
        done();
      }, 100);
    });
  });

  describe('#sendSubscription', () => {
    beforeEach(() => {
      sinon.stub(subscriptionsApi, 'subscribe').resolves();
      sinon.stub(notificationsService, 'success');
    });

    afterEach(() => {
      subscriptionsApi.subscribe.restore();
      notificationsService.success.restore();
    });


    it('should remove error', () => {

      wrapper.vm.error = 'C\'est un problème';


      component.sendSubscription();


      expect(wrapper.vm.error).toEqual(null);
    });

    describe('when email is empty', () => {
      it('should set error', () => {

        wrapper.vm.email = '';


        component.sendSubscription();


        expect(wrapper.vm.error).toEqual('emailError');
      });

      it('should not call sendSubscription', () => {

        wrapper.vm.email = '';


        component.sendSubscription();


        expect(subscriptionsApi.subscribe).not.toHaveBeenCalled;
      });
    });

    describe('when email does not follow good pattern', () => {
      it('should set error', () => {

        wrapper.vm.email = 'pierrerecontact';


        component.sendSubscription();


        expect(wrapper.vm.error).toEqual('emailError');
      });

      it('should not call sendSubscription', () => {

        wrapper.vm.email = 'pierre@recontact.m';


        component.sendSubscription();


        expect(subscriptionsApi.subscribe).not.toHaveBeenCalled;
      });
    });

    it('should call the API with good params', () => {

      component.sendSubscription(email);


      expect(subscriptionsApi.subscribe).toHaveBeenCalledWith(email);
    });

    it('should display success notification', () => {

      notificationsService.success.resolves({});


      component.sendSubscription();


      return Vue.nextTick().then(() => {
        const message = 'subscriptionSuccess';
        expect(notificationsService.success).toHaveBeenCalledWith(component, message);
      });
    });

    it('should close modal', () => {

      component.$modal.show('subscribe-modal');
      wrapper.vm.email = 'email@recontact.me';


      component.sendSubscription();


      return Vue.nextTick().then(() => {
        expect(wrapper.find('.subscribe-modal')).not.to.exist;
      });
    });

    describe('when sendSubscription fails', () => {
      beforeEach(() => {
        subscriptionsApi.subscribe.restore();
        component.$modal.show('subscribe-modal');
        wrapper.vm.email = 'email@recontact.me';
        sinon.stub(subscriptionsApi, 'subscribe').rejects(new Error('e'));
      });

      it('should not close modal', () => {

        component.sendSubscription();


        return Vue.nextTick().then(() => {
          expect(wrapper.find('.subscribe-modal')).to.exist;
        });
      });

      it('should set error', () => {

        component.sendSubscription();


        return Vue.nextTick().then(() => {
          expect(wrapper.vm.error).toEqual('subscriptionError');
        });
      });
    });
  });

  describe('#cancelSubscription', () => {
    it('should close modal', () => {

      component.$modal.show('subscribe-modal');


      component.cancelSubscription();


      return Vue.nextTick().then(() => {
        expect(wrapper.find('.subscribe-modal')).not.to.exist;
      });
    });
  });

  it.skip('should sendSubscription on click on "send" button', () => {

    component.$modal.show('subscribe-modal');
    sinon.stub(component, 'sendSubscription');

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.subscribe-modal__action--send');


      myButton.click();


      expect(component.sendSubscription).toHaveBeenCalled;
    });
  });

  it.skip('should cancelSubscription on click on "cancel" button', () => {

    component.$modal.show('subscribe-modal');
    sinon.stub(component, 'cancelSubscription');

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.subscribe-modal__action--cancel');


      myButton.click();


      expect(component.cancelSubscription).toHaveBeenCalled;
    });
  });

  describe('locales', () => {
    const languages = Object.keys(SubscribeModal.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(SubscribeModal.i18n.messages.fr);

        it('contains 8 locales', () => {
          expect(locales.length).toEqual(8);
          expect(locales).toEqual([
            'subscribe',
            'modalText',
            'email',
            'confirm',
            'cancel',
            'emailError',
            'subscriptionError',
            'subscriptionSuccess',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(SubscribeModal.i18n.messages.en);

        it('contains 8 locales', () => {
          expect(locales.length).toEqual(8);
          expect(locales).toEqual([
            'subscribe',
            'modalText',
            'email',
            'confirm',
            'cancel',
            'emailError',
            'subscriptionError',
            'subscriptionSuccess',
          ]);
        });
      });
    });
  });
});
