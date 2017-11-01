import Vue from 'vue';
import syncApi from '@/api/sync';
import AppHeader from '@/components/AppHeader';

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
    it('should call syncApi', () => {
      // given
      sinon.stub(syncApi, 'launch').resolves({});

      // when
      component.synchronise();

      // then
      return Vue.nextTick().then(() => {
        expect(syncApi.launch).to.have.been.calledWith();
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
