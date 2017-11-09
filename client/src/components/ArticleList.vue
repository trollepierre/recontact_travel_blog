<template>
  <!--todo refaire l'arborescence (job ? + page ?)-->
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <div class="job-results-panel">
          <section class="article-results">
            <h1 class="article-results__title">{{ title }}</h1>
            <button v-if="adminMode" class="article-results__sync" type="button" :disabled="isClicked"
                    @click.prevent.once="synchronise">Réparer tous les articles
            </button>
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
  import syncApi from '@/api/sync';
  import notificationsService from '@/services/notifications';

  export default {
    name: 'ArticleList',
    components: {
      'article-card': ArticleCard,
    },
    props: ['adminMode'],
    data() {
      return {
        articles: [],
        isClicked: false,
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

      disableButton() {
        this.isClicked = true;
      },

      synchronise() {
        this.disableButton();
        syncApi.launch()
          .then(() => {
            const message = 'La synchronisation s\'est effectuée sans problème !';
            notificationsService.success(this, message);
          })
          .catch((err) => {
            const message = `Erreur : Problème durant la synchronisation : ${err.message}`;
            notificationsService.error(this, message);
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

  .article-results__sync {
    text-transform: uppercase;
    color: #d14800;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 230px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .article-results__sync:hover {
    background: #d14800;
    color: #ffffff;
  }

  .article-results__sync:disabled,
  .article__footer button:active {

    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }


</style>
