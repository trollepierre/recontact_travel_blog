import Vue from 'vue';
import VueModal from 'vue-js-modal';
import App from '@/App';

Vue.use(VueModal);

describe('Unit | Component | App.vue', () => {
  let component;

  beforeEach(() => {
    // given
    const Constructor = Vue.extend(App);

    // when
    component = new Constructor().$mount();
  });

  it('should be named "App"', () => {
    expect(component.$options.name).to.equal('App');
  });
});
