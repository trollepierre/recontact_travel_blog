<template>
  <!--todo refaire l'arborescence (job ? + page ?)-->
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-results">
          <h1 class="article-results__title hidden">
            {{ title }}
          </h1>
          <p class="article-results__title h1">
            {{ $t("subtitle") }}
          </p>
          <p class="article-results__title h2">
            {{ $t("lastKnownPosition") }}
            <span class="article-results__title h3">
              {{ lastPosition }}
            </span>
          </p>
          <template v-if="adminMode">
            <admin-dashboard @updateLastPositionData="updateLastPositionData"/>
          </template>
          <ul class="article-results__list">
            <li
              v-for="article in articles"
              :key="article.dropboxId"
              class="article-results__item">
              <article-card
                :article="article"
                :admin-mode="adminMode"/>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
  import ArticleCard from './ArticleCard.vue'
  import AdminDashboard from './admin-dashboard/AdminDashboard.vue'
  import articlesApi from '../api/articles'
  import positionsApi from '../api/positions'
  import articlesSorter from '../services/articlesSorter'

  export default {
    name: 'ArticleList',
    components: {
      AdminDashboard,
      ArticleCard,
    },
    props: {
      adminMode: { type: Boolean, default: () => false },
    },
    data() {
      return {
        articles: [],
        lastPosition: '',
      }
    },
    computed: {
      title() {
        return this.adminMode ? this.$t('fixWebsite') : this.$t('theArticlesOfTheTrip')
      },
    },
    mounted() {
      this.getArticles()
      this.getLastPosition()
    },
    methods: {
      getArticles() {
        articlesApi.fetchAll()
          .then(articles => {
            this.articles = articlesSorter.sortByDropboxId(articles)
          })
      },

      updateLastPositionData({ place, time }) {
        this.lastPosition = `${place}, ${time}`
      },

      getLastPosition() {
        positionsApi.fetchLast()
          .then(this.updateLastPositionData)
      },
    },

    i18n: {
      messages: {
        fr: {
          fixWebsite: 'Réparer le site',
          theArticlesOfTheTrip: 'Blog de voyage de Pierre Trollé et Benoît Lefebvre après un tour du monde et d’autres aventures',
          lastPosition: 'Dernière position  :',
          subtitle: 'Pierre en voyage',
          lastKnownPosition: 'Dernière position connue  :',
        },
        en: {
          fixWebsite: 'Fix the website',
          theArticlesOfTheTrip: 'Travel blog of Pierre Trollé and Benoît Lefebvre after a world trip and other adventures',
          lastPosition: 'Last position:',
          subtitle: 'Traveling Pierre',
          lastKnownPosition: 'Last known position:',
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

  .article-results {
    margin-bottom: 60px;
  }

  .article-results__title {
    font-weight: 300;
    font-size: 24px;
    margin: 0 0 15px;
  }

  .hidden {
    display: none;
  }

  .h2 {
    font-size: 16px;
  }

  .h3 {
    font-size: 16px;
    font-weight: 600;
  }

  .article-results__list {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
