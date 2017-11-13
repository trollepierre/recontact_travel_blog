import Vue from 'vue';
import router from '@/router';
import AppHeader from '@/components/AppHeader';

describe('Unit | Component | AppHeader.vue', () => {
  let component;

  beforeEach(() => {
    // given
    const Constructor = Vue.extend(AppHeader);

    // when
    component = new Constructor({
      router,
    }).$mount();
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

    it('should display a button to alert a problem', () => {
      expect(component.$el.querySelector('button.navbar-action.navbar-action__problem')).to.exist;
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

  describe('#goToAdmin', () => {
    beforeEach(() => {
      sinon.stub(component.$router, 'push').resolves({});
    });

    afterEach(() => {
      component.$router.push.restore();
    });

    it('should redirect to admin page', () => {
      // when
      component.goToAdmin();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$router.push).to.have.been.calledWith('/admin');
      });
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

  describe('clicking on button "Signaler un problème"', () => {
    it('should call goToAdmin', () => {
      // given
      sinon.stub(component, 'goToAdmin').resolves({});

      // when
      component.$el.querySelector('button.navbar-action.navbar-action__problem').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.goToAdmin).to.have.been.called;

        // after
        component.goToAdmin.restore();
      });
    });
  });

  describe('locales', () => {
    const languages = Object.keys(AppHeader.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).to.equal(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(AppHeader.i18n.messages.fr);

        it('contains 3 locales', () => {
          expect(locales.length).to.equal(3);
          expect(locales).to.deep.equal(['subscribe', 'suggestion', 'problem']);
        });
      });

      describe('en', () => {
        const locales = Object.keys(AppHeader.i18n.messages.en);

        it('contains 3 locales', () => {
          expect(locales.length).to.equal(3);
          expect(locales).to.deep.equal(['subscribe', 'suggestion', 'problem']);
        });
      });
    });
  });
});
