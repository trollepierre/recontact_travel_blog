import Vue from 'vue';
import FeedbackModal from './FeedbackModal';
import feedbacksApi from '../api/feedbacks';
import notificationsService from '../services/notifications';

xdescribe('Component | FeedbackModal.vue', () => {
  let wrapper

  const feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?';
  const email = 'pierre@recontact.me';

  beforeEach(() => {

    const Constructor = Vue.extend(FeedbackModal);


    let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue,
      data() {
        return {
          feedback,
          email,
        };
      },
    })
  });

  it('should be named "FeedbackModal"', () => {
    expect(wrapper.name()).toEqual('FeedbackModal');
  });

  describe('template', () => {
    it('should match snapshot', () => {
      let localVue; localVue = createLocalVue(); wrapper = shallowMount(AppHeader, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })

  it('should have empty error', () => {
    expect(wrapper.vm.error).toEqual(null);
  });

  it('should have message with height to 152px', () => {
    expect(wrapper.vm.heightMessage).toEqual('152px');
  });

  describe('rendering', () => {
    it('should display the modal', () => {

      component.$modal.show('feedback-modal');


      return Vue.nextTick().then(() => {
        expect(wrapper.find('.feedback-modal')).to.exist;
      });
    });
  });

  describe('#beforeOpen', () => {
    it('should reset feedback', () => {

      wrapper.vm.feedback = 'Coucou';


      component.beforeOpen();


      expect(wrapper.vm.feedback).toEqual(null);
    });

    it('should reset email', () => {

      wrapper.vm.email = 'Coucou@contact.me';


      component.beforeOpen();


      expect(wrapper.vm.email).toEqual(null);
    });

    it('should reset height', () => {

      wrapper.vm.heightMessage = '34px';


      component.beforeOpen();


      expect(wrapper.vm.heightMessage).toEqual('152px');
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
    it.skip('should focus on input feedback content', (done) => {

      component.$modal.show('feedback-modal');


      setTimeout(() => {

        const inputSubscribe = wrapper.find('input#feedback-email');
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

      wrapper.vm.error = 'C\'est un problème';


      component.sendFeedback();


      expect(wrapper.vm.error).toEqual(null);
    });

    describe('when email is empty', () => {
      it('should set error', () => {

        wrapper.vm.email = '';


        component.sendFeedback();


        expect(wrapper.vm.error).toEqual('emailError');
      });

      it('should set error height', () => {

        wrapper.vm.email = '';


        component.sendFeedback();


        expect(wrapper.vm.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {

        wrapper.vm.email = '';


        component.sendFeedback();


        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    describe('when email does not follow the good pattern', () => {
      it('should set error', () => {

        wrapper.vm.email = '@recontact.me';


        component.sendFeedback();


        expect(wrapper.vm.error).toEqual('emailError');
      });

      it('should set error height', () => {

        wrapper.vm.email = 'pierre@recontact.m';


        component.sendFeedback();


        expect(wrapper.vm.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {

        wrapper.vm.email = 'pierre@recontact.m';


        component.sendFeedback();


        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    describe('when feedback is empty', () => {
      it('should set error', () => {

        wrapper.vm.feedback = '';


        component.sendFeedback();


        expect(wrapper.vm.error).toEqual('feedbackError');
      });

      it('should set error height', () => {

        wrapper.vm.feedback = '';


        component.sendFeedback();


        expect(wrapper.vm.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {

        wrapper.vm.feedback = '';


        component.sendFeedback();


        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    describe('when trimmed feedback is empty', () => {
      it('should set error', () => {

        wrapper.vm.feedback = ' ';


        component.sendFeedback();


        expect(wrapper.vm.error).toEqual('feedbackError');
      });

      it('should set error height', () => {

        wrapper.vm.feedback = ' \n';


        component.sendFeedback();


        expect(wrapper.vm.heightMessage).toEqual('90px');
      });

      it('should not call sendFeedback', () => {

        wrapper.vm.feedback = '';


        component.sendFeedback();


        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled;
      });
    });

    it('should call the API with good params', () => {

      component.sendFeedback();


      expect(feedbacksApi.sendFeedback).toHaveBeenCalledWith(feedback, email);
    });

    it('should display success notification', () => {

      notificationsService.success.resolves({});


      component.sendFeedback();


      return Vue.nextTick().then(() => {
        const message = 'sendingSuccess';
        expect(notificationsService.success).toHaveBeenCalledWith(component, message);
      });
    });

    it('should close modal', () => {

      notificationsService.success.resolves({});
      component.$modal.show('feedback-modal');
      wrapper.vm.email = 'email@recontact.me';
      wrapper.vm.feedback = 'Coucou';


      component.sendFeedback();


      return Vue.nextTick().then(() => {
        expect(wrapper.find('.feedback-modal')).not.to.exist;
      });
    });

    describe('when sendFeedback fails', () => {
      beforeEach(() => {
        feedbacksApi.sendFeedback.restore();
        component.$modal.show('feedback-modal');
        sinon.stub(feedbacksApi, 'sendFeedback').rejects(new Error('e'));
        wrapper.vm.feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?';
        wrapper.vm.email = 'contact@recontact.me';
        wrapper.vm.heightMessage = '12px';
      });

      it('should not close modal', () => {

        component.sendFeedback();


        return Vue.nextTick().then(() => {
          expect(wrapper.find('.feedback-modal')).to.exist;
        });
      });

      it('should set error', () => {

        component.sendFeedback();


        return Vue.nextTick().then(() => {
          expect(wrapper.vm.error).toEqual('sendingError');
        });
      });

      it('should set error height', () => {

        component.sendFeedback();


        return Vue.nextTick().then(() => {
          expect(wrapper.vm.heightMessage).toEqual('90px');
        });
      });
    });
  });

  describe('#cancelFeedback', () => {
    it('should close modal', () => {

      component.$modal.show('feedback-modal');


      component.cancelFeedback();


      return Vue.nextTick().then(() => {
        expect(wrapper.find('.feedback-modal')).not.to.exist;
      });
    });
  });

  it.skip('should sendFeedback on click on "send" button', () => {

    component.$modal.show('feedback-modal');
    sinon.stub(component, 'sendFeedback');

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.feedback-modal__action--send');


      myButton.click();


      expect(component.sendFeedback).toHaveBeenCalled;
    });
  });

  it.skip('should cancelFeedback on click on "cancel" button', () => {

    component.$modal.show('feedback-modal');
    sinon.stub(component, 'cancelFeedback');

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.feedback-modal__action--cancel');


      myButton.click();


      expect(component.cancelFeedback).toHaveBeenCalled;
    });
  });

  describe('locales', () => {
    const languages = Object.keys(FeedbackModal.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(FeedbackModal.i18n.messages.fr);

        it('contains 10 locales', () => {
          expect(locales.length).toEqual(10);
          expect(locales).toEqual([
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
          expect(locales).toEqual([
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
