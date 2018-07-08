import Vue from 'vue';
import ArticleCard from './ArticleCard.vue';
// import router from '../router/router';
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

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    article = {
      dropboxId: '58',
      enTitle: 'Pierre in Costa Rica',
      frTitle: 'Pierre au Costa Rica',
      imgLink: 'webf',
      galleryLink,
    };
    propsData = {
      article,
    };
    wrapper = shallowMount(ArticleCard, { localVue, propsData })
  });

  it('should be named "ArticleCard"', () => {
    expect(wrapper.name()).toEqual('ArticleCard');
  });

  describe('when adminMode is not defined', () => {
    beforeEach(() => {
      translationsService.getTitle = jest.fn()
      translationsService.getTitle.mockReturnValue('Pierre somewhere')
    });

    describe('template', () => {
      it('should match snapshot', () => {
        wrapper = shallowMount(ArticleCard, { localVue, propsData })

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

    xdescribe('computed', () => {
      describe('computed property #articleUrl', () => {
        it('should return /articles/:id', () => {
          // When
          const { articleUrl } = wrapper.props();

          // Then
          expect(articleUrl).toEqual('/articles/58');
        });
      });

      describe('computed property #articleTitle', () => {
        it('should return articleName', () => {
          // When
          const { articleTitle } = wrapper.props();

          // Then
          expect(articleTitle).toEqual('Pierre somewhere');
        });
      });
    })

    xdescribe('methods', () => {
      describe('#disableUpdateButton', () => {
        it('should set isUpdateClicked to true', () => {
          // when
          component.disableUpdateButton();

          // then
          expect(component.$data.isUpdateClicked).to.be.true;
        });
      });

      describe('#viewArticle', () => {
        it('should redirect to /articles/:articleId', () => {
          // given
          sinon.stub(component.$router, 'push').resolves({});

          // when
          component.viewArticle();

          // then
          expect(component.$router.push).toHaveBeenCalledWith('/articles/58');

          // after
          component.$router.push.restore();
        });
      });

      describe('#goToArticle', () => {
        it('should redirect to /articles/:articleId', () => {
          // given
          sinon.stub(component.$router, 'push').resolves({});

          // when
          component.goToArticle();

          // then
          expect(component.$router.push).toHaveBeenCalledWith('/articles/58');

          // after
          component.$router.push.restore();
        });
      });

      describe('#update', () => {
        beforeEach(() => {
          // given
          sinon.stub(articlesApi, 'update');
          sinon.stub(notificationsService, 'success').resolves({});
          sinon.stub(notificationsService, 'information').resolves({});
          sinon.stub(notificationsService, 'removeInformation').resolves({});
          sinon.stub(notificationsService, 'error').resolves({});
        });

        afterEach(() => {
          articlesApi.update.restore();
          notificationsService.success.restore();
          notificationsService.information.restore();
          notificationsService.removeInformation.restore();
          notificationsService.error.restore();
        });

        it('should set isUpdateClicked to true', () => {
          // given
          articlesApi.update.resolves({});

          // when
          component.updateArticle();

          // then
          expect(component.$data.isUpdateClicked).to.be.true;
        });

        it('should call delete article api', () => {
          // given
          articlesApi.update.resolves({});

          // when
          component.updateArticle();

          // then
          expect(articlesApi.update).toHaveBeenCalledWith();
        });

        it('should display success toast notification before synchronisation calls', () => {
          // given
          articlesApi.update.resolves({});

          // when
          component.updateArticle();

          // then
          const message = 'syncLaunched';
          expect(notificationsService.information).toHaveBeenCalledWithExactly(component, message);
        });

        it('should redirect to /article/id', () => {
          // given
          sinon.stub(component.$router, 'push').resolves({});
          articlesApi.update.resolves({});

          // when
          component.updateArticle();

          // then
          return Vue.nextTick().then(() => {
            expect(component.$router.push).toHaveBeenCalledWith('/articles/58');
            // after
            component.$router.push.restore();
          });
        });

        it('should display success toast notification when synchronisation succeeds', () => {
          // given
          articlesApi.update.resolves({});

          // when
          component.updateArticle();

          // then
          return Vue.nextTick().then(() => {
            expect(notificationsService.removeInformation).toHaveBeenCalledWithExactly(component);
            const message = 'syncDone';
            expect(notificationsService.success).toHaveBeenCalledWithExactly(component, message);
          });
        });

        it('should display error toast notification when synchronisation fails', () => {
          // given
          articlesApi.update.rejects(new Error('Expected error'));

          // when
          component.updateArticle();

          // then
          return Vue.nextTick().then(() => {
            expect(notificationsService.removeInformation).toHaveBeenCalledWithExactly(component);
            const message = 'syncError Error: Expected error';
            expect(notificationsService.error).toHaveBeenCalledWithExactly(component, message);
          });
        });
      });
    })

    xdescribe('events', () => {
      describe('clicking on button "Voir l\'article"', () => {
        it('should redirect to /article/id', () => {
          // given
          sinon.stub(component.$router, 'push').resolves({});

          // when
          wrapper.find('button.article__view-button').click();

          // then
          expect(component.$router.push).toHaveBeenCalledWith('/articles/58');
          // after
          component.$router.push.restore();
        });
      });

      describe('clicking on title', () => {
        it('should redirect to /article/id', () => {
          // given
          sinon.stub(component.$router, 'push').resolves({});

          // when
          wrapper.find('.article__header a').click();

          // then
          expect(component.$router.push).toHaveBeenCalledWith('/articles/58');

          // after
          component.$router.push.restore();
        });
      });

      describe('clicking on image', () => {
        it('should redirect to /article/id', () => {
          // given
          sinon.stub(component.$router, 'push').resolves({});

          // when
          wrapper.find('.article__content').click();

          // then
          expect(component.$router.push).toHaveBeenCalledWith('/articles/58');

          // after
          component.$router.push.restore();
        });
      });
    })
  });

  xdescribe('when adminMode is true', () => {
    let wrapper
    let article;

    beforeEach(() => {
      article = {
        dropboxId: '58',
        imgLink: 'webf',
      };
      const Constructor = Vue.extend(ArticleCard);
      let localVue;
      localVue = createLocalVue();
      wrapper = shallowMount(AppHeader, {
        localVue,
        router,
        propsData: {
          article,
          adminMode: true,
        },
      })
    });

    describe('clicking on button "reparer l\'article"', () => {
      beforeEach(() => {
        // given
        sinon.stub(articlesApi, 'update').resolves({});
        sinon.stub(notificationsService, 'success').resolves({});
        sinon.stub(notificationsService, 'information').resolves({});
        sinon.stub(notificationsService, 'removeInformation').resolves({});
        sinon.stub(notificationsService, 'error').resolves({});
      });

      afterEach(() => {
        articlesApi.update.restore();
        notificationsService.success.restore();
        notificationsService.information.restore();
        notificationsService.removeInformation.restore();
        notificationsService.error.restore();
      });

      it('should disable button', () => {
        // when
        wrapper.find('button.article__update-button').click();

        // then
        return Vue.nextTick().then(() => {
          expect(wrapper.find('.article__update-button').disabled).to.be.true;
        });
      });

      it('should call articlesApi', () => {
        // when
        wrapper.find('button.article__update-button').click();

        // then
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
