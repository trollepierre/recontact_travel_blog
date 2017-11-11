<template>
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-page">
          <h1 class="article-page__title">Pierre dans un pays trop stylé, n'est-ce pas ?</h1>
          <ul class="chapter__list">
            <!--todo pour égaliser :-->
            <!--https://masonry.desandro.com/-->
            <!--https://stackoverflow.com/questions/22929755/how-to-accomplish-something-like-google-keep-layout-->
            <li v-for="chapter in chapters" class="chapter__item">
              <chapter-card :chapter="chapter"></chapter-card>
            </li>
          </ul>
        </section>
        <aside>
          <h2 class="article-page__photo-title">Voici la galerie photo de cet article !</h2>
          <ul class="photo__list">
            <!--todo pour égaliser :-->
            <!--https://masonry.desandro.com/-->
            <!--https://stackoverflow.com/questions/22929755/how-to-accomplish-something-like-google-keep-layout-->
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

  export default {
    name: 'ArticlePage',
    components: {
      'chapter-card': ChapterCard,
      'photo-card': PhotoCard,
    },
    data() {
      return {
        chapters: [],
        photos: [{ imgLink: 'https://www.dropbox.com/s/tk2qzdf6u1brv6o/img0.jpg?dl=1' }],
      };
    },
    mounted() {
      this.getChapters();
      this.getPhotos();
    },
    methods: {
      getChapters() {
        chaptersApi.fetch(this.$route.params.id)
          .then((chapters) => {
            (this.chapters = chapters);
          });
      },
      getPhotos() {
        photosApi.fetch(this.$route.params.id)
          .then((photos) => {
            (this.photos = photos);
          });
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

  .chapter__list {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .chapter__item {
    list-style-type: none;
    padding: 0;
    width: 100%;
    margin: 5px;
  }

  @media only screen and (min-width: 640px) {
    .chapter__list {
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
