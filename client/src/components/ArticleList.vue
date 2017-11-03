<template>
  <!--todo refaire l'arborescence (job ? + page ?)-->
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <div class="job-results-panel">
          <section class="article-results">
            <h1 class="article-results__title">{{ title }}</h1>
            <ul class="article-results__list">
              <li v-for="article in articles" class="article-results__item">
                <article-card :article="article" :adminMode="adminMode"></article-card>
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
    props: ['adminMode'],
    data() {
      return {
        articles: [],
      };
    },
    mounted() {
      this.getArticles();
    },
    computed: {
      title() {
        return (this.adminMode) ? 'Administrer le site' : 'Les articles du voyage';
      },
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

</style>
