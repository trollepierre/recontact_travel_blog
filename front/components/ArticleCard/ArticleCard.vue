<template xmlns:v-lazy="http://www.w3.org/1999/xhtml">
  <div class="article-card">
    <article class="article">
      <header class="article__header">
        <a
          :href="articleUrl"
          class="article__link"
          @click.prevent.once="viewArticle">
          <h2 class="article__title">
            {{ articleTitle }}
          </h2>
        </a>
      </header>
      <div
        class="article__content"
        @click.prevent.once="viewArticle">
        <template v-if="lazy">
          <div ref="container">
            <img
              v-lazy="article.imgLink"
              :alt="articleTitle"
              rel="noreferrer"
              class="article__image">
            <div v-lazy:background-image="article.imgLink"/>
          </div>
        </template>
        <img
          v-else
          :src="article.imgLink"
          :alt="articleTitle"
          class="article__image important"
          width="200">
      </div>
      <footer class="article__footer">
        <template v-if="adminMode">
          <button
            :disabled="isUpdateClicked"
            class="article__update-button article__footer__button"
            @click.prevent.once="updateArticle">
            {{ $t("repairArticle") }}
          </button>
          <button
            :disabled="isDeleteClicked"
            class="article__delete-button article__footer_hidden article__footer__button"
            @click.prevent.once="deleteArticle">
            {{ $t("deleteArticle") }}
          </button>
        </template>
        <template v-else>
          <button
            class="article__footer__button"
            @click.prevent.once="viewArticle">
            {{ $t("goToArticle") }}
          </button>
          <a
            :href="article.galleryLink"
            target="_blank"
            class="article__dropbox">
            <button class="article__dropbox-button article__footer__button">
              {{ $t("viewGallery") }}
            </button>
          </a>
        </template>
      </footer>
    </article>
  </div>
</template>

<script>
  import articlesApi from '../../services/api/articles'
  import notificationsService from '../../services/services/notifications'
  import translationsService from '../../services/services/translations'

  export default {
    name: 'ArticleCard',
    props: {
      adminMode: { type: Boolean, default: () => false },
      article: { type: Object, default: () => {} },
      lazy: { type: Boolean, default: () => true },
    },
    data() {
      return {
        isUpdateClicked: false,
        isDeleteClicked: false,
      }
    },
    computed: {
      articleUrl() {
        return `/articles/${this.article.dropboxId}`
      },
      articleTitle() {
        const language = this.$store.state.locale
        return translationsService.getTitle(this.article, language)
      },
    },
    methods: {
      viewArticle() {
        this.goToArticle()
      },

      updateArticle() {
        this.trackEvent()
        this.disableUpdateButton()
        notificationsService.information(this, this.$t('syncLaunched'))
        articlesApi.update(this.article.dropboxId)
          .then(() => {
            notificationsService.removeInformation(this)
            notificationsService.success(this, this.$t('syncDone'))
          })
          .then(() => this.goToArticle())
          .catch(err => {
            notificationsService.removeInformation(this)
            notificationsService.error(this, `${this.$t('syncError')} ${err}`)
          })
      },

      disableUpdateButton() {
        this.isUpdateClicked = true
      },

      trackEvent() {
      // this.$ga.event({
      //   eventCategory: 'Article Card',
      //   eventAction: 'update',
      //   eventLabel: `article ${this.article.dropboxId} is updated`,
      // })
      },

      deleteArticle() {
        this.disableDeleteButton()
        notificationsService.information(this, this.$t('deleteLaunched'))
        articlesApi.delete(this.article.dropboxId)
          .then(() => {
            notificationsService.removeInformation(this)
            notificationsService.success(this, this.$t('deleteDone'))
          })
          .catch(err => {
            notificationsService.removeInformation(this)
            notificationsService.error(this, `${this.$t('deleteError')} ${err}`)
          })
      },

      disableDeleteButton() {
        this.isDeleteClicked = true
      },

      goToArticle() {
        this.$router.push(this.articleUrl)
      },
    },

    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          repairArticle: 'Réparer l’article',
          deleteArticle: 'Supprimer l’article',
          goToArticle: 'Voir l’article',
          viewGallery: 'Voir les photos',
          syncLaunched: 'La synchronisation est lancée ! Patientez quelques secondes...',
          syncDone: 'La synchronisation s’est effectuée sans problème  !',
          syncError: 'Erreur : Problème durant la synchronisation  :',
          deleteLaunched: 'La suppression est lancée ! Patientez quelques secondes...',
          deleteDone: 'La suppression s’est effectuée sans problème  !',
          deleteError: 'Erreur : Problème durant la suppression  :',
        },
        en: {
          repairArticle: 'Repair the article',
          deleteArticle: 'Delete the article',
          goToArticle: 'Read the article',
          viewGallery: 'Discover the pictures',
          syncLaunched: 'The synchronisation is launched! Please wait...',
          syncDone: 'The synchronisation succeeds!',
          syncError: 'Error during the synchronisation:',
          deleteLaunched: 'The deletion is launched! Please wait...',
          deleteDone: 'The deletion succeeds!',
          deleteError: 'Error during the deletion:',
        },
      },
    },
  }
</script>

<style scoped>
  .article__image[lazy="loaded"], .important {
    max-width: 100%;
    max-height: 40vw;
    width: 200px;
    height: 150px;
    color: darkgrey;
  }

  @media only screen and (max-width: 640px) {
    .article__image[lazy="loaded"], .important {
      max-height: 100%;
      width: 200px;
      height: 150px;
    }
  }

  .article {
    min-width: 260px;
    max-width: 260px;
    background: #FFFFFF;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .article__header {
    border-bottom: 1px solid #E6E6E6;
    height: 34px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
  }

  .article__link {
    margin: auto;
  }

  .article__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 17px;
    color: #07C;
    margin: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }

  .article__content {
    font-size: 15px;
    padding: 15px;
    height: 150px;
    color: #000;
    text-align: center;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .article__footer {
    text-align: center;
    padding: 15px 15px 5px;
    border-top: 1px solid #E6E6E6;
  }

  .article__footer__button {
    text-transform: uppercase;
    color: #D14800;
    background: #FFFFFF;
    border: 1px solid #D14800;
    cursor: pointer;
    padding: 12px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
    font-family: serif;
    font-size: 12px;
  }

  .article__footer_hidden {
    color: #f7b5a9;
  }

  .article__footer__button:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .article__footer__button:disabled,
  .article__footer__button:active {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }

  @media only screen and (max-width: 640px) {
    .article {
      max-width: inherit;
    }
  }

  @media only screen and (min-width: 640px) {
    .article__title {
      font-size: 18px;
      max-width: 235px;
    }
  }
</style>
