import Vue from 'vue';
import VueModal from 'vue-js-modal';
import FeedbackModal from '@/components/FeedbackModal';
import feedbacksApi from '@/api/feedbacks';
import notificationService from '@/services/notification';

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

  it('should have empty error', () => {
    expect(component.$data.error).to.equal(null);
  });

  it('should have message with height to 152px', () => {
    expect(component.$data.heightMessage).to.equal('152px');
  });

  describe('rendering', () => {
    it('should display the modal', () => {
      // when
      component.$modal.show('feedback-modal');

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.feedback-modal')).to.exist;
      });
    });
  });

  describe('#beforeOpen', () => {
    it('should reset feedback', () => {
      // given
      component.$data.feedback = 'Coucou';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.feedback).to.equal(null);
    });

    it('should reset email', () => {
      // given
      component.$data.email = 'Coucou@contact.me';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.email).to.equal(null);
    });

    it('should reset height', () => {
      // given
      component.$data.heightMessage = '34px';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.heightMessage).to.equal('152px');
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

  describe('#sendFeedback', () => {
    beforeEach(() => {
      sinon.stub(feedbacksApi, 'sendFeedback').resolves();
      sinon.stub(notificationService, 'success');
    });

    afterEach(() => {
      feedbacksApi.sendFeedback.restore();
      notificationService.success.restore();
    });

    it('should remove error', () => {
      // given
      component.$data.error = 'C\'est un problème';

      // when
      component.sendFeedback();

      // then
      expect(component.$data.error).to.equal(null);
    });

    describe('when email is empty', () => {
      it('should set error', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).to.equal('Vous devez saisir un email.');
      });

      it('should set error height', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).to.equal('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.to.have.been.called;
      });
    });

    describe('when trimmed email is empty', () => {
      it('should set error', () => {
        // given
        component.$data.email = ' ';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).to.equal('Vous devez saisir un email.');
      });

      it('should set error height', () => {
        // given
        component.$data.email = ' \n';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).to.equal('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.to.have.been.called;
      });
    });

    describe('when feedback is empty', () => {
      it('should set error', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).to.equal('Vous devez saisir un message.');
      });

      it('should set error height', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).to.equal('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.to.have.been.called;
      });
    });

    describe('when trimmed feedback is empty', () => {
      it('should set error', () => {
        // given
        component.$data.feedback = ' ';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).to.equal('Vous devez saisir un message.');
      });

      it('should set error height', () => {
        // given
        component.$data.feedback = ' \n';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).to.equal('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.to.have.been.called;
      });
    });

    it('should call the API with good params', () => {
      // when
      component.sendFeedback();

      // then
      expect(feedbacksApi.sendFeedback).to.have.been.calledWith(feedback, email);
    });

    it('should display success notification', () => {
      // given
      notificationService.success.resolves({});

      // when
      component.sendFeedback();

      // then
      return Vue.nextTick().then(() => {
        const message = 'Ton message a été envoyé.';
        expect(notificationService.success).to.have.been.calledWith(component, message);
      });
    });

    it('should close modal', () => {
      // given
      notificationService.success.resolves({});
      component.$modal.show('feedback-modal');
      component.$data.email = 'email@recontact.me';
      component.$data.feedback = 'Coucou';

      // when
      component.sendFeedback();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.feedback-modal')).not.to.exist;
      });
    });

    describe('when sendFeedback fails', () => {
      beforeEach(() => {
        feedbacksApi.sendFeedback.restore();
        component.$modal.show('feedback-modal');
        sinon.stub(feedbacksApi, 'sendFeedback').rejects(new Error('e'));
        component.$data.feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?';
        component.$data.email = 'contact@recontact.me';
        component.$data.heightMessage = '12px';
      });

      it('should not close modal', () => {
        // when
        component.sendFeedback();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$el.querySelector('.feedback-modal')).to.exist;
        });
      });

      it('should set error', () => {
        // when
        component.sendFeedback();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$data.error).to.equal('Une erreur est survenue durant l\'envoi du message.');
        });
      });

      it('should set error height', () => {
        // when
        component.sendFeedback();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$data.heightMessage).to.equal('90px');
        });
      });
    });
  });

  describe('#cancelFeedback', () => {
    it('should close modal', () => {
      // given
      component.$modal.show('feedback-modal');

      // when
      component.cancelFeedback();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('.feedback-modal')).not.to.exist;
      });
    });
  });

  it.skip('should sendFeedback on click on "send" button', () => {
    // Given
    component.$modal.show('feedback-modal');
    sinon.stub(component, 'sendFeedback');

    return Vue.nextTick().then(() => {
      const myButton = component.$el.querySelector('.feedback-modal__action--send');

      // When
      myButton.click();

      // Then
      expect(component.sendFeedback).to.have.been.called;
    });
  });

  it.skip('should cancelFeedback on click on "cancel" button', () => {
    // Given
    component.$modal.show('feedback-modal');
    sinon.stub(component, 'cancelFeedback');

    return Vue.nextTick().then(() => {
      const myButton = component.$el.querySelector('.feedback-modal__action--cancel');

      // When
      myButton.click();

      // Then
      expect(component.cancelFeedback).to.have.been.called;
    });
  });
});
