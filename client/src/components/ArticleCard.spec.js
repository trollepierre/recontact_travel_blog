import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAnalytics from 'vue-analytics';

import ArticleCard from './ArticleCard.vue';

import notificationsService from '../services/notifications';
import translationsService from '../services/translations';
import articlesApi from '../api/articles';
import VueI18n from 'vue-i18n';

describe('Component | ArticleCard.vue', () => {
  let localVue
  let wrapper
  const galleryLink = 'https://www.dropbox.com/sh/k79oskpopi9lm8v/AABst0JslmKYw3Rhx9BjwJxMa?dl=0';
  let article;
  let propsData;
  const dropboxId = '58';
  const router = {
    init: jest.fn(),
    push: jest.fn(),
    history: {},
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueAnalytics, { id: '12' })

    article = {
      dropboxId,
      enTitle: 'Pierre in Costa Rica',
      frTitle: 'Pierre au Costa Rica',
      imgLink: 'webf',
      galleryLink,
    };
    propsData = {
      article,
    };
    wrapper = shallowMount(ArticleCard, { localVue, propsData, router })
  });

  it('should be named "ArticleCard"', () => {
    expect(wrapper.name()).toEqual('ArticleCard');
  });

  describe('when adminMode is not defined', () => {
    beforeEach(() => {
      translationsService.getTitle = jest.fn()
      translationsService.getTitle.mockReturnValue('Pierre somewhere')
      wrapper = shallowMount(ArticleCard, { localVue, propsData, router })
    });

    describe('template', () => {
      it('should match snapshot', () => {
        expect(wrapper.element).toMatchSnapshot()
      })

      it('should have enabled article button', () => {
        expect(wrapper.find('.article__view-button').disabled).toBeUndefined()
      });

      it('should have enabled dropbox button', () => {
        expect(wrapper.find('.article__dropbox-button').disabled).toBeUndefined()
      });
    });

    describe('$data', () => {
      it('should have isUpdateClicked property set to false', () => {
        expect(wrapper.vm.isUpdateClicked).toEqual(false)
      });
      it('should have isDeleteClicked property set to false', () => {
        expect(wrapper.vm.isDeleteClicked).toEqual(false)
      });
    });

    describe('computed', () => {
      describe('#articleUrl', () => {
        it('should return /articles/:id', () => {
          expect(wrapper.vm.articleUrl).toEqual('/articles/58');
        });
      });

      describe('#articleTitle', () => {
        it('should return articleName', () => {
          expect(wrapper.vm.articleTitle).toEqual('Pierre somewhere');
        });
      });
    })

    describe('methods', () => {
      describe('#disableUpdateButton', () => {
        it('should set isUpdateClicked to true', () => {
          wrapper.vm.disableUpdateButton();

          expect(wrapper.vm.isUpdateClicked).toEqual(true)
        });
      });

      describe('#viewArticle', () => {
        it('should redirect to /articles/:articleId', () => {
          wrapper = shallowMount(ArticleCard, { localVue, propsData, router })

          wrapper.vm.viewArticle();

          expect(router.push).toHaveBeenCalledWith('/articles/58');
        });
      });

      describe('#goToArticle', () => {
        it('should redirect to /articles/:articleId', () => {
          wrapper = shallowMount(ArticleCard, { localVue, propsData, router })

          wrapper.vm.goToArticle();

          expect(router.push).toHaveBeenCalledWith('/articles/58');
        });
      });

      describe('#updateArticle', () => {
        beforeEach(() => {
          articlesApi.update = jest.fn()
          notificationsService.success = jest.fn()
          notificationsService.information = jest.fn()
          notificationsService.removeInformation = jest.fn()
          notificationsService.error = jest.fn()
        });

        it('should set isUpdateClicked to true', () => {
          articlesApi.update.mockResolvedValue({});

          wrapper.vm.updateArticle();

          expect(wrapper.vm.isUpdateClicked).toEqual(true)
        });

        it('should call delete article api', () => {
          articlesApi.update.mockResolvedValue({});

          wrapper.vm.updateArticle();

          expect(articlesApi.update).toHaveBeenCalledWith(dropboxId);
        });

        it('should display success toast notification before synchronisation calls', () => {
          articlesApi.update.mockResolvedValue({});

          wrapper.vm.updateArticle();

          const message = 'syncLaunched';
          expect(notificationsService.information).toHaveBeenCalledWith(expect.anything(), message);
        });

        it('should redirect to /article/id', () => {
          articlesApi.update.mockResolvedValue({});
          wrapper = shallowMount(ArticleCard, { localVue, propsData, router })

          wrapper.vm.updateArticle();

          return Vue.nextTick().then(() => {
            expect(router.push).toHaveBeenCalledWith('/articles/58');
          });
        });

        it('should display success toast notification when synchronisation succeeds', () => {
          articlesApi.update.mockResolvedValue({});

          wrapper.vm.updateArticle();

          return Vue.nextTick().then(() => {
            expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything());
            const message = 'syncDone';
            expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message);
          });
        });

        xit('should display error toast notification when synchronisation fails', () => {
          articlesApi.update.mockRejectedValue(new Error('Expected error'));

          wrapper.vm.updateArticle();

          return Vue.nextTick().then(() => {
            expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything());
            const message = 'syncError Error: Expected error';
            expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), message);
          });
        });
      });
    })

    describe('events', () => {
      describe('clicking on button "Voir l\'article"', () => {
        it('should redirect to /article/id', () => {
          wrapper.find('button.article__view-button').trigger('click');

          expect(router.push).toHaveBeenCalledWith('/articles/58');
        });
      });

      describe('clicking on title', () => {
        it('should redirect to /article/id', () => {
          wrapper.find('.article__header a').trigger('click')

          expect(router.push).toHaveBeenCalledWith('/articles/58');
        });
      });

      describe('clicking on image', () => {
        it('should redirect to /article/id', () => {
          wrapper.find('.article__content').trigger('click')

          expect(router.push).toHaveBeenCalledWith('/articles/58');
        });
      });
    })
  });

  describe('when adminMode is true', () => {
    beforeEach(() => {
      translationsService.getTitle = jest.fn()
      translationsService.getTitle.mockReturnValue('Pierre somewhere')
      propsData = {
        article,
        adminMode: true,
      };
      wrapper = shallowMount(ArticleCard, { localVue, propsData, router })
    });

    describe('clicking on button "reparer l\'article"', () => {
      beforeEach(() => {
        articlesApi.update = jest.fn()
        articlesApi.update.mockResolvedValue({})
        notificationsService.success = jest.fn()
        notificationsService.information = jest.fn()
        notificationsService.removeInformation = jest.fn()
        notificationsService.error = jest.fn()
      });

      xit('should disable button', () => {
        wrapper.find('button.article__update-button').trigger('click')

        return Vue.nextTick().then(() => {
          expect(wrapper.find('.article__update-button').disabled).toEqual(true)
        });
      });

      fit('should call articlesApi', () => {
        wrapper.find('button.article__update-button').trigger('click')

        expect(articlesApi.update).toHaveBeenCalledWith('58');
      });
    });
  });

  describe('locales', () => {
    const languages = Object.keys(ArticleCard.i18n.messages);

    it('contains 2 languages', () => {
      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['fr', 'en']);
    });

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleCard.i18n.messages.fr);

        it('contains 10 locales', () => {
          expect(locales.length).toEqual(10);
          expect(locales).toEqual([
            'repairArticle',
            'deleteArticle',
            'goToArticle',
            'viewGallery',
            'syncLaunched',
            'syncDone',
            'syncError',
            'deleteLaunched',
            'deleteDone',
            'deleteError',
          ]);
        });
      });

      describe('en', () => {
        const locales = Object.keys(ArticleCard.i18n.messages.en);

        it('contains 10 locales', () => {
          expect(locales.length).toEqual(10);
          expect(locales).toEqual([
            'repairArticle',
            'deleteArticle',
            'goToArticle',
            'viewGallery',
            'syncLaunched',
            'syncDone',
            'syncError',
            'deleteLaunched',
            'deleteDone',
            'deleteError',
          ]);
        });
      });
    });
  });
});
