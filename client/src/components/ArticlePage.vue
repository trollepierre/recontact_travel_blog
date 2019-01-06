<template>
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-page">
          <h1 class="article-page__title">
            {{ title }}
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
        <section class="article-page__photo-gallery photo-gallery">
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
        <section class="article-page__forum forum">
          <form
            class="forum__form"
            @submit="submitComment">
            <label
              class="forum__label"
              for="comment">
              {{ $t("addComment") }}
            </label>
            <input
              id="comment"
              v-model="newComment"
              class="forum__add-comment"
              placeholder="Mon commentaire. Par Pierre">
          </form>
          <h2 class="forum__name">
            {{ $t("hereTheGallery") }}
          </h2>
          <ul class="forum__comment-list">
            <li
              v-for="comment in comments"
              :key="comment.text"
              class="comment__item">
              <comment-card :comment="comment"/>
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
  </div>
</template>

<script>
  import ChapterCard from './ChapterCard.vue'
  import PhotoCard from './PhotoCard.vue'
  import CommentCard from './common/CommentCard.vue'
  import chaptersApi from '../api/chapters'
  import photosApi from '../api/photos'
  import commentsApi from '../api/comments'
  import translationsService from '../services/translations'
  import notificationsService from '../services/notifications'

  export default {
    name: 'ArticlePage',
    components: {
      'chapter-card': ChapterCard,
      'photo-card': PhotoCard,
      CommentCard,
    },
    data() {
      return {
        chapters: [],
        photos: [],
        title: '',
        dropboxId: parseInt(this.$route.params.id, 10),
        comments: [],
        newComment: '',
        errorComment: '',
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
        this.getComments()
      },
      getChapters() {
        this.trackEvent()
        chaptersApi.fetch(this.dropboxId)
          .then(article => {
            this.chapters = article.chapters
            this.title = translationsService.getTitle(article)
          })
      },
      getPhotos() {
        photosApi.fetch(this.dropboxId)
          .then(photos => {
            this.photos = photos
          })
      },
      getComments() {
        commentsApi.fetch(this.dropboxId)
          .then(comments => {
            this.comments = comments
          })
      },
      viewPreviousArticle() {
        this.goToArticle(this.dropboxId - 1)
      },
      viewNextArticle() {
        this.goToArticle(this.dropboxId + 1)
      },
      goToHomePage() {
        this.$router.push('/')
      },
      goToArticle(idArticle) {
        this.$router.push(`/articles/${idArticle}`)
      },
      trackEvent() {
        this.$ga.event({
          eventCategory: 'Article Page',
          eventAction: 'read',
          eventLabel: `article ${this.$route.params.id} is read`,
        })
      },
      submitComment(e) {
        this.errorComment = ''
        e.preventDefault()
        if (this.newComment !== '') {
          commentsApi.send(this.dropboxId, this.newComment)
            .then(this.displaySuccessNotification)
            .catch(() => {
              this.errorComment = this.$t('commentError')
            })
        }
      },
      displaySuccessNotification() {
        notificationsService.success(this, this.$t('commentSuccess'))
      },
    },
    i18n: {
      messages: {
        fr: {
          hereTheGallery: 'Voici la galerie photo de cet article !',
          goToPreviousArticle: 'Voir l’article précédent',
          goToNextArticle: 'Voir l’article suivant',
          goToHomePage: 'Retour à la page d’accueil',
          addComment: 'Ajouter un commentaire',
          commentError: 'Erreur lors de la prise en compte de ton commentaire.',
          commentSuccess: 'Ton commentaire a été pris en compte.',
        },
        en: {
          hereTheGallery: 'Here is the photo gallery of this article',
          goToPreviousArticle: 'Read the previous article',
          goToNextArticle: 'Read the next article',
          goToHomePage: 'Go to Home Page',
          addComment: 'Add a comment',
          commentError: 'Error when adding the comment.',
          commentSuccess: 'Your comment has been taken into consideration.',
        },
      },
    },
  }
</script>

<style scoped>
  .page__body {
    display: flex;
    width: 100%;
    padding: 20px 0;
    justify-content: center;
  }

  .article-page {
    margin-bottom: 60px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .article-page__title {
    font-weight: 300;
    font-size: 24px;
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
    margin: 5px;
  }

  .footer-article {
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }

  .footer-article button {
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

  .footer-article button:hover {
    background: #d14800;
    color: #ffffff;
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
  }

  @media only screen and (min-width: 640px) {
    .page__container {
      max-width: 544px;
    }
  }

  @media only screen and (min-width: 992px) {
    .page__container {
      max-width: 816px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .page__container {
      max-width: 1088px;
    }
  }

</style>
