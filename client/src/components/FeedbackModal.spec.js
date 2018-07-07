import Vue from 'vue';
import FeedbackModal from './FeedbackModal';
import feedbacksApi from '../api/feedbacks';
import notificationsService from '../services/notifications';

xdescribe('Unit | Component | FeedbackModal.vue', () => {
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
    expect(component.$options.name).toEqual('FeedbackModal');
  });

  it('should have empty error', () => {
    expect(component.$data.error).toEqual(null);
  });

  it('should have message with height to 152px', () => {
    expect(component.$data.heightMessage).toEqual('152px');
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
      expect(component.$data.feedback).toEqual(null);
    });

    it('should reset email', () => {
      // given
      component.$data.email = 'Coucou@contact.me';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.email).toEqual(null);
    });

    it('should reset height', () => {
      // given
      component.$data.heightMessage = '34px';

      // when
      component.beforeOpen();

      // then
      expect(component.$data.heightMessage).toEqual('152px');
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
    it.skip('should focus on input feedback content', (done) => {
      // given
      component.$modal.show('feedback-modal');

      // when
      setTimeout(() => {
        // then
        const inputSubscribe = component.$el.querySelector('input#feedback-email');
        expect(inputSubscribe).to.have.focus();
        done();
      }, 100);
    });
  });

  describe('#sendFeedback', () => {
    beforeEach(() => {
      sinon.stub(feedbacksApi, 'sendFeedback').resolves();
      sinon.stub(notificationsService, 'success');
    });

    afterEach(() => {
      feedbacksApi.sendFeedback.restore();
      notificationsService.success.restore();
    });

    it('should remove error', () => {
      // given
      component.$data.error = 'C\'est un problème';

      // when
      component.sendFeedback();

      // then
      expect(component.$data.error).toEqual(null);
    });

    describe('when email is empty', () => {
      it('should set error', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).toEqual('emailError');
      });

      it('should set error height', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.email = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    describe('when email does not follow the good pattern', () => {
      it('should set error', () => {
        // given
        component.$data.email = '@recontact.me';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).toEqual('emailError');
      });

      it('should set error height', () => {
        // given
        component.$data.email = 'pierre@recontact.m';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.email = 'pierre@recontact.m';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    describe('when feedback is empty', () => {
      it('should set error', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).toEqual('feedbackError');
      });

      it('should set error height', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    describe('when trimmed feedback is empty', () => {
      it('should set error', () => {
        // given
        component.$data.feedback = ' ';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.error).toEqual('feedbackError');
      });

      it('should set error height', () => {
        // given
        component.$data.feedback = ' \n';

        // when
        component.sendFeedback();

        // then
        expect(component.$data.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {
        // given
        component.$data.feedback = '';

        // when
        component.sendFeedback();

        // then
        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    it('should call the API with good params', () => {
      // when
      component.sendFeedback();

      // then
      expect(feedbacksApi.sendFeedback).toHaveBeenCalledWith(feedback, email);
    });

    it('should display success notification', () => {
      // given
      notificationsService.success.resolves({});

      // when
      component.sendFeedback();

      // then
      return Vue.nextTick().then(() => {
        const message = 'sendingSuccess';
        expect(notificationsService.success).toHaveBeenCalledWith(component, message);
      });
    });

    it('should close modal', () => {
      // given
      notificationsService.success.resolves({});
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
          expect(component.$data.error).toEqual('sendingError');
        });
      });

      it('should set error height', () => {
        // when
        component.sendFeedback();

        // then
        return Vue.nextTick().then(() => {
          expect(component.$data.heightMessage).toEqual('90px');
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
      expect(component.sendFeedback).toHaveBeenCalled;
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
      expect(component.cancelFeedback).toHaveBeenCalled;
    });
  });

  describe('locales', () => {
    const languages = Object.keys(FeedbackModal.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(FeedbackModal.i18n.messages.fr);

        it('contains 10 locales', () => {
          expect(locales.length).toEqual(10);
          expect(locales).to.deep.equal([
            'suggest',
            'content',
            'placeholder',
            'email',
            'send',
            'cancel',
            'emailError',
            'feedbackError',
            'sendingError',
            'sendingSuccess',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(FeedbackModal.i18n.messages.en);

        it('contains 10 locales', () => {
          expect(locales.length).toEqual(10);
          expect(locales).to.deep.equal([
            'suggest',
            'content',
            'placeholder',
            'email',
            'send',
            'cancel',
            'emailError',
            'feedbackError',
            'sendingError',
            'sendingSuccess',
          ]);
        });
      });
    });
  });
});
