<template>
  <div class="homepage">
    <app-header/>
    <div class="container">
      <main class="main">
        <h1 class="h1">
          {{ $t("mapHeadline") }}
        </h1>
        <world-map/>
        <p class="see-more">
          {{ $t("seeMore") }}
        </p>
        <app-button
          class="see-articles"
          :text="$t('seeArticles')"
          @click="goToArticles"/>
      </main>
      <aside v-if="hasArticles">
        <article-list
          :articles-number-limit="articlesNumberLimit"/>
      </aside>
    </div>
  </div>
</template>

<script>
  import ArticleList from '@/components/ArticleList/ArticleList'
  import { IS_DESKTOP } from '@/services/utils/responsive/responsive-utils'
  import WorldMap from './Map/Map.vue'
  import AppHeader from '../AppHeader/AppHeader.vue'
  import { articlesNumberLimit } from '~/components/Homepage/Homepage.utils'
  import AppButton from '~/components/AppButton/AppButton'

  export default {
    components: {
      AppButton,
      ArticleList,
      AppHeader,
      WorldMap,
    },
    data() {
      return {
        hasArticles: false,
      }
    },
    computed: {
      articlesNumberLimit,
    },
    beforeMount() {
      window.addEventListener('touchstart', this.handleTouch)
    },
    beforeDestroy() {
      window.removeEventListener('touchstart', this.handleTouch)
    },
    mounted() {
      if (IS_DESKTOP()) {
        this.hasArticles = true
      }
    },
    methods: {
      handleTouch() {
        this.hasArticles = true
        window.removeEventListener('touchstart', this.handleTouch)
      },
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

<style lang="scss" scoped>
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

.see-articles {
  max-width: 300px;
}

@media only screen and (min-width: $md-breakpoint) {
  .h1 {
    font-size: 32px;
  }
}

@media only screen and (min-width: $xl-breakpoint) {
  .container {
    flex-direction: row;
  }
}
</style>
