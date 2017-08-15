import Vue from 'vue';
import ParagraphCard from '@/components/ParagraphCard';

describe('ParagraphCard.vue', () => {
  let component;

  beforeEach(() => {
    const paragraph = {
      title: 'Titre du premier paragraphe',
      imgLink: 'webf', // fix provisoire pour le offline
      // imgLink: '../assets/webf.jpg',
      text: 'some blabla',
    };
    const Constructor = Vue.extend(ParagraphCard);
    component = new Constructor({
      propsData: {
        paragraph,
      },
    }).$mount();
  });

  it('should be named "ParagraphCard"', () => {
    expect(component.$options.name).to.equal('ParagraphCard');
  });

  describe('render', () => {
    it('should render paragraph title', () => {
      const paragraphTitle = component.$el.querySelector('.paragraph__title');
      expect(paragraphTitle.textContent).to.equal('Titre du premier paragraphe');
    });

    it('should render paragraph image', () => {
      const paragraphLink = component.$el.querySelector('img');
      expect(paragraphLink.getAttribute('src')).to.contain('webf'); // fix pour le offline
    });
  });
});
