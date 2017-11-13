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
        <aside>
          <h2 class="article-page__photo-title">{{ $t("hereTheGallery") }}</h2>
          <ul class="photo__list">
            <li v-for="photo in photos" class="photo__item">
              <photo-card :photo="photo"></photo-card>
            </li>
          </ul>
        </aside>
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
      };
    },
    mounted() {
      this.getChapters();
      this.getPhotos();
    },
    methods: {
      getChapters() {
        chaptersApi.fetch(this.$route.params.id)
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
    },
    i18n: {
      messages: {
        fr: {
          hereTheGallery: 'Voici la galerie photo de cet article !',
        },
        en: {
          hereTheGallery: 'Here is the photo gallery of this article',
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
    margin-top: 60px;
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

  .chapter__list, .photo__list  {
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
    .chapter__list, .photo__list  {
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
