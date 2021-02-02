<template>
  <div class="homepage">
    <app-header/>
    <div class="container">
      <main class="main">
        <h1 class="h1">
          {{ $t("mapHeadline") }}
        </h1>
        <world-map/>
        <p class="see-more">{{ $t("seeMore") }}</p>
        <button
          type="button"
          class="button see-articles"
          @click.prevent.once="goToArticles">
          {{ $t("seeArticles") }}
        </button>
      </main>
      <article-list
        :articles-number-limit="articlesNumberLimit"/>
    </div>
  </div>
</template>

<script>
  import ArticleList from '@/components/ArticleList/ArticleList'
  import { screenWidth } from '@/services/utils/screen/screen-utils'
  import { IS_DESKTOP } from '@/services/utils/responsive/responsive-utils'
  import WorldMap from './Map/Map.vue'
  import AppHeader from '../AppHeader/AppHeader.vue'

  export default {
    components: {
      ArticleList,
      AppHeader,
      WorldMap,
    },
    computed: {
      articlesNumberLimit() {
        if (!IS_DESKTOP()) {
          return 4
        }
        if (screenWidth() <= 1240) {
          return 3
        }
        return Math.floor((screenWidth() - 960) / 300) * 2
      },
    },
    methods: {
      goToArticles() {
        this.$router.push('/articles')
      },
    },
    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          mapHeadline: 'Retrouvez nos articles à travers le monde :',
          seeMore: 'Envie d’en voir toujours plus ?',
          seeArticles: 'Voir la liste exhaustive des articles',
        },
        en: {
          mapHeadline: 'Retrieve our articles all around the world:',
          seeMore: 'Want to see always more?',
          seeArticles: 'See the full list of articles',
        },
      },
    },
  }
</script>

<style scoped>
.h1 {
  margin-bottom: 30px;
  font-size: 20px;
}

.homepage {
  display: flex;
  justify-content: center;
}

.main {
  margin-top: 60px;
}

.container {
  display: flex;
  flex-direction: column;
}

.see-more {
  margin: 20px;
}

.button {
  line-height: 28px;
  color: #F48024;
  text-decoration: unset;
  font-size: 11px;
  font-family: serif;
  text-transform: uppercase;
  background: #FFFFFF;
  border: 1px solid #F48024;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 4px;
  width: 100%;
  font-weight: 700;
}

.button:hover {
  background: #D14800;
  color: #FFFFFF;
}

.see-articles {
  max-width: 300px;
}

@media only screen and (min-width: 650px) {
  .h1 {
    font-size: 32px;
  }
}

@media only screen and (min-width: 1240px) {
  .container {
    flex-direction: row;
  }
}
</style>
