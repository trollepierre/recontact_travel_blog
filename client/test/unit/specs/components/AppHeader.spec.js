import Vue from 'vue';
import syncApi from '@/api/sync';
import AppHeader from '@/components/AppHeader';
import notificationService from '@/services/notification';

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

    it('should display a button to synchronise', () => {
      expect(component.$el.querySelector('button.navbar-action.navbar-action__sync')).to.exist;
    });
  });

  describe('synchronise', () => {
    beforeEach(() => {
      // given
      sinon.stub(syncApi, 'launch');
      sinon.stub(notificationService, 'success').resolves({});
      sinon.stub(notificationService, 'error').resolves({});
    });

    afterEach(() => {
      syncApi.launch.restore();
      notificationService.success.restore();
      notificationService.error.restore();
    });

    it('should call syncApi', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(syncApi.launch).to.have.been.calledWith();
      });
    });

    it('should display success toast notification when subscription succeeds', () => {
      // given
      syncApi.launch.resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        const message = 'La synchronisation s\'est effectuée sans problème !';
        expect(notificationService.success).to.have.been.calledWithExactly(component, message);
      });
    });

    it('should display error toast notification when subscription fails', () => {
      // given
      syncApi.launch.rejects(new Error('Expected error'));

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        const message = 'Erreur : Problème durant la synchronisation : Expected error';
        expect(notificationService.error).to.have.been.calledWithExactly(component, message);
      });
    });
  });

  describe('clicking on button "Synchronise"', () => {
    it('should disable button', () => {
      // when
      component.$el.querySelector('button.navbar-action.navbar-action__sync').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.$el.querySelector('button.navbar-action.navbar-action__sync').disabled).to.be.true;
      });
    });

    it('should call synchronise api', () => {
      // given
      sinon.stub(component, 'synchronise').resolves({});

      // when
      component.$el.querySelector('button.navbar-action.navbar-action__sync').click();

      // then
      return Vue.nextTick().then(() => {
        expect(component.synchronise).to.have.been.called;
      });
    });
  });
});
