import Vue from 'vue';
import VueModal from 'vue-js-modal';
import AppHeader from '@/components/AppHeader';

Vue.use(VueModal);

describe('Unit | Component | AppHeader.vue', () => {
  let component;

  beforeEach(() => {
    // given
    const Constructor = Vue.extend(AppHeader);

    // when
    component = new Constructor().$mount();
  });

  it('should be named "AppHeader"', () => {
    expect(component.$options.name).to.equal('AppHeader');
  });

  describe('rendering', () => {
    it('should display a link to home', () => {
      expect(component.$el.querySelector('.logo-link')).to.exist;
    });

    it('should display a button to subscribe', () => {
      expect(component.$el.querySelector('button.navbar-action.navbar-action__subscribe')).to.exist;
    });

    it('should display a button to suggest', () => {
      expect(component.$el.querySelector('button.navbar-action.navbar-action__suggestion')).to.exist;
    });
  });

  describe('#displaySubscribeModal', () => {
    beforeEach(() => {
      sinon.stub(component.$modal, 'show');
    });

    afterEach(() => {
      component.$modal.show.restore();
    });

    it('should display the subscribe-modal', () => {
      // when
      component.displaySubscribeModal();

      // then
      expect(component.$modal.show).to.have.been.calledWith('subscribe-modal');
    });
  });

  describe('#displayFeedbackModal', () => {
    beforeEach(() => {
      sinon.stub(component.$modal, 'show');
    });

    afterEach(() => {
      component.$modal.show.restore();
    });

    it('should display the feedback-modal', () => {
      // when
      component.displayFeedbackModal();

      // then
      expect(component.$modal.show).to.have.been.calledWith('feedback-modal');
    });
  });

  describe('clicking on button "Laisser un message"', () => {
    it('should call displayFeedbackModal', () => {
      // given
      sinon.stub(component, 'displayFeedbackModal').resolves({});

      // when
      component.$el.querySelector('button.navbar-action.navbar-action__suggestion').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.displayFeedbackModal).to.have.been.called;

        // after
        component.displayFeedbackModal.restore();
      });
    });
  });

  describe('clicking on button "S\'abonner"', () => {
    it('should call displaySubscribeModal', () => {
      // given
      sinon.stub(component, 'displaySubscribeModal').resolves({});

      // when
      component.$el.querySelector('button.navbar-action.navbar-action__subscribe').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.displaySubscribeModal).to.have.been.called;

        // after
        component.displaySubscribeModal.restore();
      });
    });
  });
});
