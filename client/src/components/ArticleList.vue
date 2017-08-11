<template>
  <div class="article-list">
    <section class="article-results">
      <h1 class="article-results__title">Les articles du voyage</h1>
      <ul class="articles-results__list">
        <li v-for="article in articles" class="articles-results__item">
          <article-card :article="article"></article-card>
        </li>
      </ul>
    </section>
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
            imgLink: '../assets/webf.jpg',
          }, {
            name: '59 : Pierre au Koezio',
            imgLink: '/assets/koezio.jpg',
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
  h1 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }
</style>
