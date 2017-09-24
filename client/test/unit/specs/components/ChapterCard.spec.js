import Vue from 'vue';
import ChapterCard from '@/components/ChapterCard';

describe('ChapterCard.vue', () => {
  let component;

  beforeEach(() => {
    const chapter = {
      title: 'Titre du premier paragraphe',
      imgLink: 'webf', // fix provisoire pour le offline
      // imgLink: '../assets/webf.jpg',
      text: 'some blabla',
    };
    const Constructor = Vue.extend(ChapterCard);
    component = new Constructor({
      propsData: {
        chapter,
      },
    }).$mount();
  });

  it('should be named "ChapterCard"', () => {
    expect(component.$options.name).to.equal('ChapterCard');
  });

  describe('render', () => {
    it('should render chapter title', () => {
      const chapterTitle = component.$el.querySelector('h2');
      expect(chapterTitle.textContent).to.equal('Titre du premier paragraphe');
    });

    it('should render chapter image', () => {
      const chapterLink = component.$el.querySelector('img');
      expect(chapterLink.getAttribute('src')).to.contain('webf'); // fix pour le offline
    });
  });
});
