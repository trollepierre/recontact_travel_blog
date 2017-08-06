import Vue from 'vue';
import axios from 'axios';
import Hello from '@/components/Hello';

describe('Hello.vue', () => {
  let component;

  beforeEach(() => {
    const response = {
      data: [{
        imgLink: 'myImgLink',
      }],
    };
    sinon.stub(axios, 'get').resolves(response);
    const Constructor = Vue.extend(Hello);
    component = new Constructor().$mount();
  });

  afterEach(() => {
    axios.get.restore();
  });

  it('should be named "hello"', () => {
    expect(component.$options.name).to.equal('hello');
  });

  it('should call axios get', () => {
    // Then
    expect(axios.get).to.have.been.calledWith();
  });

  it.skip('should render correct contents', () => {
    // Given
    expect(axios.get).to.have.been.calledWith();

    // Then
    expect(component.getImg).to.equal('myImgLink');
    expect(component.$el.querySelector('img').getAttribute('src'))
      .to.equal('myImgLink');
  });
});
