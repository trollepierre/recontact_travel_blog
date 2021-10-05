<template>
  <main>
    <app-header/>
    <div class="page">
      <section class="article-page">
        <h1 class="article-page__title">
          {{ title || $t("title") }}
        </h1>
        <ul class="chapter__list">
          <li
            v-for="(chapter, index) in chapters"
            :key="`${chapter.imgLink}${index}`"
            class="chapter__item">
            <chapter-card :chapter="chapter"/>
          </li>
        </ul>
      </section>
      <section>
        <comments/>
      </section>
      <section
        v-if="!isEmpty(photos)">
        <h2>
          {{ $t("hereTheGallery") }}
        </h2>
        <ul class="photo-gallery__list">
          <li
            v-for="(photo, index) in photos"
            :key="`${photo.imgLink}${index}`"
            class="photo__item">
            <photo-card :photo="photo"/>
          </li>
        </ul>
      </section>
      <footer class="footer-article">
        <app-button
          class="app-button"
          :text="$t('goToHomePage')"
          @click="goToHomePage"/>
        <app-button
          class="app-button"
          :text="$t('goToPreviousArticle')"
          @click="viewPreviousArticle"/>
        <app-button
          class="app-button"
          :text="$t('goToNextArticle')"
          @click="viewNextArticle"/>
      </footer>
    </div>
  </main>
</template>

<script>
  import { isEmptyPlus as isEmpty } from '../../services'
  import ChapterCard from '../ChapterCard/ChapterCard.vue'
  import PhotoCard from '../PhotoCard/PhotoCard.vue'
  import Comments from '../comments/Comments.vue'
  import chaptersApi from '../../services/api/chapters'
  import photosApi from '../../services/api/photos'
  import translationsService from '../../services/services/translations'
  import logger from '../../services/services/logger-service'
  import AppHeader from '../AppHeader/AppHeader.vue'
  import AppButton from '../AppButton/AppButton.vue'

  export default {
    name: 'ArticlePage',
    components: {
      ChapterCard,
      Comments,
      PhotoCard,
      AppHeader,
      AppButton,
    },
    data() {
      return {
        chapters: [{
          position: 1,
          frTitle: 'Article en cours de chargement',
          enTitle: 'Loading article',
          imgLink: false,
          frText: ['Veuillez patienter quelques secondes'],
          enText: ['Please wait just a second'],
        }],
        photos: [],
        title: '',
        dropboxId: parseInt(this.$route.params.id, 10),
      }
    },
    watch: {
      $route(to) {
        window.scrollTo(0, 0)
        this.dropboxId = parseInt(to.params.id, 10)
        this.fetchArticle()
      },
    },
    mounted() {
      this.fetchArticle()
    },
    methods: {
      fetchArticle() {
        this.getChapters()
        this.getPhotos()
      },
      getChapters() {
        chaptersApi.fetch(this.dropboxId)
          .then(article => {
            this.chapters = article.chapters
            const language = this.$store.state.locale
            this.title = translationsService.getTitle(article, language)
          })
          .catch(error => {
            logger.error(error.message)
          })
      },
      getPhotos() {
        photosApi.fetch(this.dropboxId)
          .then(photos => {
            this.photos = photos
          })
      },
      viewPreviousArticle() {
        if (this.dropboxId !== 1) { this.goToArticle(this.dropboxId - 1) }
      },
      viewNextArticle() {
        this.goToArticle(this.dropboxId - 1 + 2)
      },
      goToHomePage() {
        this.$router.push('/')
      },
      goToArticle(idArticle) {
        this.$router.push(`/articles/${idArticle}`)
      },
      isEmpty,
    },
    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          hereTheGallery: 'Voici la galerie photo de cet article  !',
          goToPreviousArticle: 'Voir l’article précédent',
          goToNextArticle: 'Voir l’article suivant',
          goToHomePage: 'Retour à la page d’accueil',
          title: 'Titre de l’article',
        },
        en: {
          hereTheGallery: 'Here is the photo gallery of this article',
          goToPreviousArticle: 'Read the previous article',
          goToNextArticle: 'Read the next article',
          goToHomePage: 'Go to Home Page',
          title: 'Title of the article',
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    padding-top: 70px;
    margin: auto;
  }

  .article-page {
    margin-bottom: 60px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .article-page__title {
    font-weight: 300;
    font-size: 32px;
    margin: 0 0 15px;
    max-width: 80%;
  }

  .chapter__list, .photo-gallery__list {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .chapter__item, .photo__item {
    list-style-type: none;
    padding: 0;
    width: 100%;
    margin: 5px 0;
  }

  .footer-article {
    text-align: center;
    padding: 15px;
  }

  .app-button {
    margin-bottom: 10px;
    max-width: 300px;
    padding: 8px 30px;
  }

  .app-button:disabled,
  .app-button:active {
    background: $button-disabled-bg;
    border-color: $button-disabled-border;
    color: $button-disabled-color;
    cursor: auto;
  }

  @media only screen and (min-width: 640px) {
    .chapter__list, .photo-gallery__list {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .chapter__item, .photo__item {
      margin: 5px;
    }
  }

  @media only screen and (min-width: 640px) {
    .page {
      max-width: 544px;
    }
  }

  @media only screen and (min-width: 992px) {
    .page {
      max-width: 816px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .page {
      max-width: 1088px;
    }
  }

</style>
