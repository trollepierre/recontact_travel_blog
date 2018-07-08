import Vue from 'vue';
import SubscribeModal from './SubscribeModal';
import subscriptionsApi from '../api/subscriptions';
import notificationsService from '../services/notifications';

xdescribe('Component | SubscribeModal.vue', () => {
  let component;
  const email = 'pierre@recontact.me';

  beforeEach(() => {
    // given
    const Constructor = Vue.extend(SubscribeModal);

    // when
    component = new Constructor({
      data() {
        return {
          email,
        };
      },
    }).$mount();
  });

  it('should be named "SubscribeModal"', () => {
    expect(component.$options.name).toEqual('SubscribeModal');
  });

  describe('rendering', () => {
    it('should display the modal', () => {
      component.$modal.show('subscribe-modal');

      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.subscribe-modal')).to.exist;
      });
    });
  });

  describe('#beforeOpen', () => {
    it('should reset email', () => {
      // given
      component.$data.email = 'Coucou@contact.me';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.email).toEqual(null);
    });

    it('should remove error', () => {
      // given
      component.$data.error = 'C\'est un problème';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.error).toEqual(null);
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
      // when
      component.opened();

      // then
      expect(component._focusOnInput).toHaveBeenCalledWith();
    });

    it('should close on escape key', () => {
      // when
      component.opened();

      // then
      const e = document.createEvent('Events');
      e.initEvent('keydown', true, true);
      e.keyCode = 27;
      document.dispatchEvent(e);

      return Vue.nextTick().then(() => {
        expect(component._closeModal).toHaveBeenCalledWith();
      });
    });

    it('should not close on any other key than space', () => {
      // when
      component.opened();

      // then
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
      // given
      component.$modal.show('subscribe-modal');

      // when
      setTimeout(() => {
        // then
        const inputSubscribe = component.$el.querySelector('input#subscribe-content');
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
      // given
      component.$data.error = 'C\'est un problème';

      // when
      component.sendSubscription();

      // then
      expect(component.$data.error).toEqual(null);
    });

    describe('when email is empty', () => {
      it('should set error', () => {
        // given
        component.$data.email = '';

        // when
        component.sendSubscription();

        // then
        expect(component.$data.error).toEqual('emailError');
      });

      it('should not call sendSubscription', () => {
        // given
        component.$data.email = '';

        // when
        component.sendSubscription();

        // then
        expect(subscriptionsApi.subscribe).not.toHaveBeenCalled;
      });
    });

    describe('when email does not follow good pattern', () => {
      it('should set error', () => {
        // given
        component.$data.email = 'pierrerecontact';

        // when
        component.sendSubscription();

        // then
        expect(component.$data.error).toEqual('emailError');
      });

      it('should not call sendSubscription', () => {
        // given
        component.$data.email = 'pierre@recontact.m';

        // when
        component.sendSubscription();

        // then
        expect(subscriptionsApi.subscribe).not.toHaveBeenCalled;
      });
    });

    it('should call the API with good params', () => {
      // when
      component.sendSubscription(email);

      // then
      expect(subscriptionsApi.subscribe).toHaveBeenCalledWith(email);
    });

    it('should display success notification', () => {
      // given
      notificationsService.success.resolves({});

      // when
      component.sendSubscription();

      // then
      return Vue.nextTick().then(() => {
        const message = 'subscriptionSuccess';
        expect(notificationsService.success).toHaveBeenCalledWith(component, message);
      });
    });

    it('should close modal', () => {
      // given
      component.$modal.show('subscribe-modal');
      component.$data.email = 'email@recontact.me';

      // when
      component.sendSubscription();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.subscribe-modal')).not.to.exist;
      });
    });

    describe('when sendSubscription fails', () => {
      beforeEach(() => {
        subscriptionsApi.subscribe.restore();
        component.$modal.show('subscribe-modal');
        component.$data.email = 'email@recontact.me';
        sinon.stub(subscriptionsApi, 'subscribe').rejects(new Error('e'));
      });

      it('should not close modal', () => {
        // when
        component.sendSubscription();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$el.querySelector('.subscribe-modal')).to.exist;
        });
      });

      it('should set error', () => {
        // when
        component.sendSubscription();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$data.error).toEqual('subscriptionError');
        });
      });
    });
  });

  describe('#cancelSubscription', () => {
    it('should close modal', () => {
      // given
      component.$modal.show('subscribe-modal');

      // when
      component.cancelSubscription();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.subscribe-modal')).not.to.exist;
      });
    });
  });

  it.skip('should sendSubscription on click on "send" button', () => {
    // Given
    component.$modal.show('subscribe-modal');
    sinon.stub(component, 'sendSubscription');

    return Vue.nextTick().then(() => {
      const myButton = component.$el.querySelector('.subscribe-modal__action--send');

      // When
      myButton.click();

      // Then
      expect(component.sendSubscription).toHaveBeenCalled;
    });
  });

  it.skip('should cancelSubscription on click on "cancel" button', () => {
    // Given
    component.$modal.show('subscribe-modal');
    sinon.stub(component, 'cancelSubscription');

    return Vue.nextTick().then(() => {
      const myButton = component.$el.querySelector('.subscribe-modal__action--cancel');

      // When
      myButton.click();

      // Then
      expect(component.cancelSubscription).toHaveBeenCalled;
    });
  });

  describe('locales', () => {
    const languages = Object.keys(SubscribeModal.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(SubscribeModal.i18n.messages.fr);

        it('contains 8 locales', () => {
          expect(locales.length).toEqual(8);
          expect(locales).to.deep.equal([
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
          expect(locales).to.deep.equal([
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
