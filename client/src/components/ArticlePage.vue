<template>
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-page">
          <h1 class="article-page__title">{{ title }}</h1>
          <ul class="chapter__list">
            <li v-for="chapter in chapters" class="chapter__item">
              <chapter-card :chapter="chapter"></chapter-card>
            </li>
          </ul>
        </section>
        <aside class="article-page__photo-gallery photo-gallery">
          <h2 class="photo-gallery__title">{{ $t("hereTheGallery") }}</h2>
          <ul class="photo-gallery__list">
            <li v-for="photo in photos" class="photo__item">
              <photo-card :photo="photo"></photo-card>
            </li>
          </ul>
        </aside>
        <footer class="article-page__footer footer-article">
          <button class="footer-article__previous" @click="viewPreviousArticle">
            {{ $t("goToPreviousArticle") }}
          </button>
          <button class="footer-article__next" @click="viewNextArticle">
            {{ $t("goToNextArticle") }}
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
  import ChapterCard from '@/components/ChapterCard';
  import PhotoCard from '@/components/PhotoCard';
  import chaptersApi from '@/api/chapters';
  import photosApi from '@/api/photos';
  import translationsService from '@/services/translations';

  export default {
    name: 'ArticlePage',
    components: {
      'chapter-card': ChapterCard,
      'photo-card': PhotoCard,
    },
    data() {
      return {
        chapters: [],
        photos: [],
        title: '',
        dropboxId: parseInt(this.$route.params.id, 10),
      };
    },
    mounted() {
      this.getChapters();
      this.getPhotos();
    },
    methods: {
      getChapters() {
        chaptersApi.fetch(this.dropboxId)
          .then((article) => {
            (this.chapters = article.chapters);
            (this.title = translationsService.getTitle(article));
          });
      },
      getPhotos() {
        photosApi.fetch(this.$route.params.id)
          .then((photos) => {
            (this.photos = photos);
          });
      },
      viewPreviousArticle() {
        this.goToArticle(this.dropboxId - 1);
      },
      viewNextArticle() {
        this.goToArticle(this.dropboxId + 1);
      },
      goToArticle(idArticle) {
        console.log('go to');

        this.$router.push(`/articles/${idArticle}`);
        this.dropboxId = idArticle;
        this.getChapters();
        this.getPhotos();
      },
    },
    i18n: {
      messages: {
        fr: {
          hereTheGallery: 'Voici la galerie photo de cet article !',
          goToPreviousArticle: 'Voir l‘article précédent',
          goToNextArticle: 'Voir l‘article suivant',
        },
        en: {
          hereTheGallery: 'Here is the photo gallery of this article',
          goToPreviousArticle: 'Read the previous article',
          goToNextArticle: 'Read the next article',
        },
      },
    },
  };
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

  .chapter__list, .photo-gallery__list  {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .chapter__item, .photo__item  {
    list-style-type: none;
    padding: 0;
    width: 100%;
    margin: 5px;
  }

  @media only screen and (min-width: 640px) {
    .chapter__list, .photo-gallery__list  {
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
