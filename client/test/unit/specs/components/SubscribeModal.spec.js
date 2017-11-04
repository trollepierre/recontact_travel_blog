import Vue from 'vue';
import VueModal from 'vue-js-modal';
import SubscribeModal from '@/components/SubscribeModal';
import subscriptionsApi from '@/api/subscriptions';

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

  describe('#sendSubscription', () => {
    beforeEach(() => {
      sinon.stub(subscriptionsApi, 'subscribe').resolves();
    });

    afterEach(() => {
      subscriptionsApi.subscribe.restore();
    });

    it('should call the API with good params', () => {
      // when
      component.sendSubscription(email);

      // then
      expect(subscriptionsApi.subscribe).to.have.been.calledWith(email);
    });

    it.skip('should send interests on click on "send" button', () => {
      // Given
      component.$modal.show('subscribe-panel');

      return Vue.nextTick().then(() => {
        const myButton = component.$el.querySelector('.subscribe-modal__action--send');

        // When
        myButton.click();

        // Then
        expect(subscriptionsApi.subscribe).to.have.been.calledWith(email);
      });
    });

    it.skip('should test the whole thing');

    it.skip('should close the modal');
  });
});
