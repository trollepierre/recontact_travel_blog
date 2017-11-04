import Vue from 'vue';
import VueModal from 'vue-js-modal';
import FeedbackModal from '@/components/FeedbackModal';
import feedbacksApi from '@/api/feedbacks';

Vue.use(VueModal);

describe('Unit | Component | FeedbackModal.vue', () => {
  let component;

  const feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?';
  const email = 'pierre@recontact.me';

  beforeEach(() => {
    // given
    const Constructor = Vue.extend(FeedbackModal);

    // when
    component = new Constructor({
      data() {
        return {
          feedback,
          email,
        };
      },
    }).$mount();
  });

  it('should be named "FeedbackModal"', () => {
    expect(component.$options.name).to.equal('FeedbackModal');
  });

  describe('rendering', () => {
    it('should display the modal', () => {
      component.$modal.show('feedback-modal');

      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.feedback-modal')).to.exist;
      });
    });
  });

  describe('#sendFeedback', () => {
    beforeEach(() => {
      sinon.stub(feedbacksApi, 'sendFeedback').resolves();
    });

    afterEach(() => {
      feedbacksApi.sendFeedback.restore();
    });

    it('should call the API with good params', () => {
      // when
      component.sendFeedback();

      // then
      expect(feedbacksApi.sendFeedback).to.have.been.calledWith(feedback, email);
    });

    it.skip('should send interests on click on "send" button', () => {
      // Given
      component.$modal.show('feedback-panel');

      return Vue.nextTick().then(() => {
        const myButton = component.$el.querySelector('.feedback-modal__action--send');

        // When
        myButton.click();

        // Then
        expect(feedbacksApi.sendFeedback).to.have.been.calledWith(feedback, email);
      });
    });

    it.skip('should test the whole thing');

    it.skip('should close the modal');
  });
});
