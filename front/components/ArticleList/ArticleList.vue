<template>
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-results">
          <h1 class="article-results__title hidden">
            {{ hiddenTitle }}
          </h1>
          <p class="article-results__title h1">
            {{ title }}
          </p>
          <p class="article-results__title h2">
            {{ subtitle }}
            <span
              v-if="!isCecile"
              class="article-results__title h3">
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
                :lazy="isLazyArticle(article.dropboxId)"
                :admin-mode="adminMode"/>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
  import ArticleCard from '../ArticleCard/ArticleCard.vue'
  import AdminDashboard from '../AdminDashboard/AdminDashboard.vue'
  import articlesApi from '../../services/api/articles'
  import positionsApi from '../../services/api/positions'
  import { isCecile, sortByDropboxId } from '../../services'

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
      hiddenTitle() {
        return this.adminMode ? this.$t('fixWebsite') : this.$t('theArticlesOfTheTrip')
      },
      title() {
        return isCecile() ? 'Mon petit Cadeau de Saint Valentin' : this.$t('title')
      },
      subtitle() {
        return isCecile() ? 'recharge le site si jamais l’article ne s’est pas chargé' : this.$t('lastKnownPosition')
      },
      isCecile() {
        return isCecile()
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
            this.articles = sortByDropboxId(articles)
          })
      },

      updateLastPositionData({ place, time }) {
        this.lastPosition = `${place}, ${time}`
      },

      getLastPosition() {
        positionsApi.fetchLast()
          .then(this.updateLastPositionData)
      },
      isLazyArticle(id) {
        return id < this.articles.length - 7
      },
    },

    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          fixWebsite: 'Réparer le site',
          theArticlesOfTheTrip: 'Blog de voyage de Pierre Trollé et Benoît Lefebvre après un tour du monde et d’autres aventures',
          lastPosition: 'Dernière position  :',
          title: 'Pierre en voyage',
          lastKnownPosition: 'Dernière position connue :',
        },
        en: {
          fixWebsite: 'Fix the website',
          theArticlesOfTheTrip: 'Travel blog of Pierre Trollé and Benoît Lefebvre after a world trip and other adventures',
          lastPosition: 'Last position:',
          title: 'Discover the world with us!',
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
    font-size: 18px;
    color: gray;
  }

  .h3 {
    font-size: 18px;
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
