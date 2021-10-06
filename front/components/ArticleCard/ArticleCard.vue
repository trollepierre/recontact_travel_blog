<template xmlns:v-lazy="http://www.w3.org/1999/xhtml">
  <article class="article">
    <a
      :href="articleUrl"
      class="article__link"
      @click.prevent.once="viewArticle">
      <h2 class="article__title">
        {{ articleTitle }}
      </h2>
    </a>
    <div
      class="article__content"
      @click.prevent.once="viewArticle">
      <template v-if="lazy">
        <img
          v-lazy="article.imgLink"
          :alt="articleTitle"
          rel="noreferrer"
          class="article__image">
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
        <form>
          <app-button
            :disabled="isUpdateChapterClicked"
            class="app-button chapter-button"
            :text="$t('repairChapter')"
            @click="updateChapter"/>
          <input class="chapter-input" v-model="chapterToRepair"/>
        </form>
        <app-button
          :disabled="isUpdateClicked"
          class="app-button"
          :text="$t('repairArticle')"
          @click="updateArticle"/>
        <app-button
          :disabled="isDeleteClicked"
          class="app-button light"
          :text="$t('deleteArticle')"
          @click="deleteArticle"/>
      </template>
      <template v-else>
        <app-button
          class="app-button"
          :text="$t('goToArticle')"
          @click="viewArticle"/>
        <app-button
          class="app-button link"
          :text="$t('viewGallery')"
          :href="article.galleryLink"
          tag="a"
          target="_blank"
          rel="noreferrer"/>
      </template>
    </footer>
  </article>
</template>

<script>
  import AppButton from '@/components/AppButton/AppButton'
  import articlesApi from '../../services/api/articles'
  import chaptersApi from '../../services/api/chapters'
  import notificationsService from '../../services/services/notifications'
  import translationsService from '../../services/services/translations'

  export default {
    name: 'ArticleCard',
    components: { AppButton },
    props: {
      adminMode: { type: Boolean, default: () => false },
      article: { type: Object, default: () => {} },
      lazy: { type: Boolean, default: () => true },
    },
    data() {
      return {
        isUpdateClicked: false,
        isUpdateChapterClicked: false,
        isDeleteClicked: false,
        chapterToRepair: '0',
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
        this.disableUpdateButton()
        notificationsService.information(this.$t('syncLaunched'))
        articlesApi.update(this.article.dropboxId)
          .then(() => {
            notificationsService.information(this.$t('syncDone'))
          })
          .then(() => this.goToArticle())
          .catch(err => {
            notificationsService.error(`${this.$t('syncError')} ${err}`)
          })
      },

      updateChapter() {
        const position = parseInt(this.chapterToRepair, 10)
        if (position <= 0 || position > 100 || Number.isNaN(position)) {
          notificationsService.error(`incorrect chapter number: ${this.chapterToRepair}`)
          return
        }

        this.disableUpdateChapterButton()
        notificationsService.information(this.$t('syncLaunched'))
        chaptersApi.update(this.article.dropboxId, position)
          .then(() => {
            notificationsService.information(this.$t('syncDone'))
          })
          .then(() => this.goToArticle())
          .catch(err => {
            notificationsService.error(`${this.$t('syncError')} ${err}`)
          })
      },

      disableUpdateButton() {
        this.isUpdateClicked = true
      },

      disableUpdateChapterButton() {
        this.isUpdateChapterClicked = true
      },

      deleteArticle() {
        this.disableDeleteButton()
        notificationsService.information(this.$t('deleteLaunched'))
        articlesApi.delete(this.article.dropboxId)
          .then(() => {
            notificationsService.information(this.$t('deleteDone'))
          })
          .catch(err => {
            notificationsService.error(`${this.$t('deleteError')} ${err}`)
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
          repairChapter: 'Réparer le chapitre',
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
          repairChapter: 'Repair the chapter',
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

<style lang="scss" scoped>
  .article__image[lazy="loaded"], .important {
    max-width: 100%;
    max-height: 40vw;
    width: 200px;
    height: 150px;
    color: $card-text;
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
    background: $card-bg;
    border-radius: 4px;
    border: 1px solid $border;
    display: flex;
    flex-direction: column;
    color: $card-color-weird;
  }

  .article__link {
    width: 100%;
    padding: 12px 0;
    margin: auto;
    text-decoration: none;
    border-bottom: 1px solid $border;
    height: 34px;
    display: flex;
    justify-content: space-between;
  }

  .article__link:hover {
    text-decoration: underline;
  }

  .article__title {
    font-size: 20px;
    font-weight: 500;
    line-height: 20px;
    color: $card-title;
    margin: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }

  .article__content {
    font-size: 15px;
    padding: 15px;
    height: 150px;
    color: $card-placeholder;
    text-align: center;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .article__footer {
    text-align: center;
    padding: 15px 15px 5px;
    border-top: 1px solid $border;
  }

  .chapter-input {
    width: 10%;
    line-height: 30px;
    font-weight: 700;
    color: var(--comment-form-color);
    background: var(--button-bg);
    border-radius: 4px;
    text-align: center;
    border-top-width: 1px;
  }

  .chapter-button {
    width: 80%;
  }

  .app-button {
    margin-bottom: 10px;
    font-size: 12px;
  }

  .app-button.link {
    display: block;
    width: inherit;
    text-decoration: unset;
  }

  .light {
    color: $button-color-light;
  }

  .app-button:disabled,
  .app-button:active {
    background: $button-disabled-bg;
    border-color: $button-disabled-border;
    color: $button-disabled-color;
    cursor: auto;
  }

  .article__dropbox {
    display: block;
    width: inherit;
    text-decoration: unset;
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
