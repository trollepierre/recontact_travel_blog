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
            v-for="chapter in chapters"
            :key="chapter.imgLink"
            class="chapter__item">
            <chapter-card :chapter="chapter"/>
          </li>
        </ul>
      </section>
      <section class="article-page__forum forum">
        <comments/>
      </section>
      <section
        v-if="!isEmpty(photos)"
        class="article-page__photo-gallery photo-gallery">
        <h2 class="photo-gallery__title">
          {{ $t("hereTheGallery") }}
        </h2>
        <ul class="photo-gallery__list">
          <li
            v-for="photo in photos"
            :key="photo.imgLink"
            class="photo__item">
            <photo-card :photo="photo"/>
          </li>
        </ul>
      </section>
      <footer class="article-page__footer footer-article">
        <button
          class="footer-article__home"
          @click="goToHomePage">
          {{ $t("goToHomePage") }}
        </button>
        <button
          class="footer-article__previous"
          @click="viewPreviousArticle">
          {{ $t("goToPreviousArticle") }}
        </button>
        <button
          class="footer-article__next"
          @click="viewNextArticle">
          {{ $t("goToNextArticle") }}
        </button>
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

  export default {
    name: 'ArticlePage',
    components: {
      ChapterCard,
      Comments,
      PhotoCard,
      AppHeader,
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
      async getChapters() {
        await chaptersApi.fetch(this.dropboxId)
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

<style scoped>
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
    border-top: 1px solid #E6E6E6;
  }

  .footer-article button {
    text-transform: uppercase;
    color: #D14800;
    background: #FFFFFF;
    border: 1px solid #D14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
    max-width: 300px;
  }

  .footer-article button:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .footer-article button:disabled,
  .footer-article button:active {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
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
