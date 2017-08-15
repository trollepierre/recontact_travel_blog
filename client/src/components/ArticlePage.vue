<template>
  <div class="page">
    <main class="page__body">
      <div class="page__container">
          <section class="article-page">
            <h1 class="article-page__title">Pierre dans un pays trop stylé, n'est-ce pas ?</h1>
            <ul class="paragraph__list">
              <li v-for="paragraph in paragraphs" class="paragraph__item">
                <paragraph-card :paragraph="paragraph"></paragraph-card>
              </li>
            </ul>
          </section>
      </div>
    </main>
  </div>
</template>

<script>
  import ParagraphCard from '@/components/ParagraphCard';
  //  import paragraphsApi from '@/api/paragraphs';

  export default {
    name: 'ParagraphPage',
    components: {
      'paragraph-card': ParagraphCard,
    },
    data() {
      return {
        paragraphs: [
          {
            name: '58 : Pierre avec les webf',
            imgLink: 'webf',
          }, {
            name: '59 : Pierre au Koezio',
            imgLink: 'koezio',
          },
          {
            name: '58 : Pierre avec les webf',
            imgLink: 'webf',
          }, {
            name: '59 : Pierre au Koezio',
            imgLink: 'koezio',
          },
          {
            name: '58 : Pierre avec les webf',
            imgLink: 'webf',
          }, {
            name: '59 : Pierre au Koezio',
            imgLink: 'koezio',
          },
        ],
      };
    },
    mounted() {
      this.getParagraphs();
    },
    methods: {
      getParagraphs() {
//        paragraphsApi.fetchAll()
//          .then((paragraphs) => {
//            this.paragraphs = paragraphs;
//          });
      },
    },
  }
  ;
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
  }

  .article-page__title {
    font-weight: 300;
    font-size: 24px;
    margin: 0 0 15px;
  }

  .paragraph__list {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .paragraph__item {
    list-style-type: none;
    padding: 0;
    margin: 5px;
  }

  @media only screen and (min-width: 640px) {
    .paragraph__list {
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
