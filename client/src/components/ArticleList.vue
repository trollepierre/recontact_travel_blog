<template>
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <div class="job-results-panel">
          <section class="article-results">
            <h1 class="article-results__title">Les articles du voyage</h1>
            <ul class="article-results__list">
              <li v-for="article in articles" class="article-results__item">
                <article-card :article="article"></article-card>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import ArticleCard from '@/components/ArticleCard';
  import articlesApi from '@/api/articles';

  export default {
    name: 'ArticleList',
    components: {
      'article-card': ArticleCard,
    },
    data() {
      return {
        articles: [
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
      this.getArticles();
    },
    methods: {
      getArticles() {
        articlesApi.fetchAll()
          .then((articles) => {
            this.articles = articles;
          });
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

  .article-results {
    margin-bottom: 60px;
  }

  .article-results__title {
    font-weight: 300;
    font-size: 24px;
    margin: 0 0 15px;
  }

  .article-results__list {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .article-results__item {
    list-style-type: none;
    padding: 0;
    margin: 5px;
  }

  @media only screen and (min-width: 640px) {
    .article-results__list {
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
