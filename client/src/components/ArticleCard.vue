<template>
  <div class="article-card">
    <article class="article">
      <header class="article__header">
        <a
          :href="articleUrl"
          @click.prevent.once="viewArticle">
          <h2 class="article__title">
            {{ articleTitle }}
          </h2>
        </a>
      </header>
      <div
        class="article__content"
        @click.prevent.once="viewArticle">
        <img
          :src="article.imgLink"
          class="article__image"
          width="200">
      </div>
      <footer class="article__footer">
        <template v-if="adminMode">
          <button
            :disabled="isUpdateClicked"
            class="article__update-button"
            @click.prevent.once="updateArticle">
            {{ $t("repairArticle") }}
          </button>
          <button
            :disabled="isDeleteClicked"
            class="article__delete-button article__footer_hidden"
            @click.prevent.once="deleteArticle">
            {{ $t("deleteArticle") }}
          </button>
        </template>
        <template v-else>
          <button
            class="article__view-button"
            @click.prevent.once="viewArticle">
            {{ $t("goToArticle") }}
          </button>
          <a
            :href="article.galleryLink"
            target="_blank"
            class="article__dropbox">
            <button class="article__dropbox-button">
              {{ $t("viewGallery") }}
            </button>
          </a>
        </template>
      </footer>
    </article>
  </div>
</template>

<script>
  import articlesApi from '../api/articles'
  import notificationsService from '../services/notifications'
  import translationsService from '../services/translations'

  export default {
    name: 'ArticleCard',
    props: {
      adminMode: { type: Boolean, default: () => false },
      article: {
        type: Object, default: () => {
        }
      },
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
        return translationsService.getTitle(this.article)
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
        this.$ga.event({
          eventCategory: 'Article Card',
          eventAction: 'update',
          eventLabel: `article ${this.article.dropboxId} is updated`,
        })
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
      messages: {
        fr: {
          repairArticle: 'Réparer l’article',
          deleteArticle: 'Supprimer l’article',
          goToArticle: 'Voir l’article',
          viewGallery: 'Voir les photos',
          syncLaunched: 'La synchronisation est lancée ! Patientez quelques secondes...',
          syncDone: 'La synchronisation s’est effectuée sans problème !',
          syncError: 'Erreur : Problème durant la synchronisation :',
          deleteLaunched: 'La suppression est lancée ! Patientez quelques secondes...',
          deleteDone: 'La suppression s’est effectuée sans problème !',
          deleteError: 'Erreur : Problème durant la suppression :',
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
  h2 {
    font-weight: normal;
  }

  img.article__image {
    max-width: 100%;
    max-height: 40vw;
  }

  @media only screen and (max-width: 640px) {
    img.article__image {
      max-height: 100%;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    display: block;
  }

  .article {
    min-width: 260px;
    max-width: 260px;
    background: #ffffff;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .article__header {
    border-bottom: 1px solid #e6e6e6;
    height: 34px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }

  .article__header a {
    margin: auto;
  }

  .article__title {
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    color: #07c;
    margin: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
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
  }

  .article__content > p {
    margin-top: 0;
  }

  .article__footer {
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }

  .article__footer button {
    text-transform: uppercase;
    color: #d14800;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .article__footer button.article__footer_hidden {
    color: #f7b5a9;
  }

  .article__footer button:hover {
    background: #d14800;
    color: #ffffff;
  }

  .article__footer button:disabled,
  .article__footer button:active {
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
</style>
