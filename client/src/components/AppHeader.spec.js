import Vue from 'vue';
import router from '../router/router';
import AppHeader from './AppHeader';

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
    expect(component.$options.name).toEqual('AppHeader');
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

    it('should display a img to go to tdm', () => {
      const link = component.$el.querySelector('a.navbar-action__tdm');
      expect(link.getAttribute('href')).toEqual('http://worldtour.recontact.me');
      const image = component.$el.querySelector('img.tdm__image');
      expect(image.getAttribute('src')).toEqual('/static/tdm.jpg');
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
      expect(component.$modal.show).toHaveBeenCalledWith('feedback-modal');
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
      expect(component.$modal.show).toHaveBeenCalledWith('subscribe-modal');
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
        expect(component.displayFeedbackModal).toHaveBeenCalled;

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
        expect(component.displaySubscribeModal).toHaveBeenCalled;

        // after
        component.displaySubscribeModal.restore();
      });
    });
  });

  describe('locales', () => {
    const languages = Object.keys(AppHeader.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).to.deep.equal(['fr', 'en']);
    });

    context('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(AppHeader.i18n.messages.fr);

        it('contains 5 locales', () => {
          expect(locales.length).toEqual(5);
          expect(locales).to.deep.equal(['subscribe', 'suggestion', 'problem', 'tdm', 'home']);
        });
      });

      describe('en', () => {
        const locales = Object.keys(AppHeader.i18n.messages.en);

        it('contains 5 locales', () => {
          expect(locales.length).toEqual(5);
          expect(locales).to.deep.equal(['subscribe', 'suggestion', 'problem', 'tdm', 'home']);
        });
      });
    });
  });
});
