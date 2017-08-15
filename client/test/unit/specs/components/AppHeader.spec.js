import Vue from 'vue';
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
  });
});
