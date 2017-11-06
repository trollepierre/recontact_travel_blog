import Vue from 'vue';
import VueModal from 'vue-js-modal';
import SubscribeModal from '@/components/SubscribeModal';
import subscriptionsApi from '@/api/subscriptions';
import notificationService from '@/services/notification';

Vue.use(VueModal);

describe('Unit | Component | SubscribeModal.vue', () => {
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
    expect(component.$options.name).to.equal('SubscribeModal');
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
      expect(component.$data.email).to.equal(null);
    });

    it('should remove error', () => {
      // given
      component.$data.error = 'C\'est un problème';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.error).to.equal(null);
    });
  });

  describe('#sendSubscription', () => {
    beforeEach(() => {
      sinon.stub(subscriptionsApi, 'subscribe').resolves();
      sinon.stub(notificationService, 'success');
    });

    afterEach(() => {
      subscriptionsApi.subscribe.restore();
      notificationService.success.restore();
    });


    it('should remove error', () => {
      // given
      component.$data.error = 'C\'est un problème';

      // when
      component.sendSubscription();

      // then
      expect(component.$data.error).to.equal(null);
    });

    describe('when email is empty', () => {
      it('should set error', () => {
        // given
        component.$data.email = '';

        // when
        component.sendSubscription();

        // then
        expect(component.$data.error).to.equal('Vous devez saisir un email.');
      });

      it('should not call sendSubscription', () => {
        // given
        component.$data.email = '';

        // when
        component.sendSubscription();

        // then
        expect(subscriptionsApi.subscribe).not.to.have.been.called;
      });
    });

    describe('when trimmed email is empty', () => {
      it('should set error', () => {
        // given
        component.$data.email = ' ';

        // when
        component.sendSubscription();

        // then
        expect(component.$data.error).to.equal('Vous devez saisir un email.');
      });

      it('should not call sendSubscription', () => {
        // given
        component.$data.email = '';

        // when
        component.sendSubscription();

        // then
        expect(subscriptionsApi.subscribe).not.to.have.been.called;
      });
    });

    it('should call the API with good params', () => {
      // when
      component.sendSubscription(email);

      // then
      expect(subscriptionsApi.subscribe).to.have.been.calledWith(email);
    });

    it('should display success notification', () => {
      // given
      notificationService.success.resolves({})

      // when
      component.sendSubscription();

      // then
      return Vue.nextTick().then(() => {
        const message = 'Ton abonnement aux alertes de Recontact Me a été pris en compte.';
        expect(notificationService.success).to.have.been.calledWith(component, message);
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
          expect(component.$data.error).to.equal('Erreur lors de la prise en compte de ton abonnement.');
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
      expect(component.sendSubscription).to.have.been.called;
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
      expect(component.cancelSubscription).to.have.been.called;
    });
  });

});
