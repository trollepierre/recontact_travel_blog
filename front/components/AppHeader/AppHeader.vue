<template>
  <header
    class="header"
    :class="{ 'navbar-hidden': !showNavbar }">
    <div class="container">
      <a
        :title="$t('home')"
        class="logo"
        href="/">
        <img
          :alt="$t('logo')"
          class="icon"
          width="38"
          height="38"
          src="../../static/velo.png">
        <span class="recontact">Recontact</span>
        <span class="me">Me</span>
      </a>
      <nav
        v-if="isArticlePage"
        aria-label="navigation">
        <ul class="navigation">
          <li class="article">
            <app-button
              v-if="previousArticleId"
              :to="previousArticleId"
              tag="nuxt-link"
              class="article"
              :text="$t('previousArticle')"/>
          </li>
          <li class="article-text">
            <p class="id">
              Article {{ articleId }}
            </p>
          </li>
          <li class="article">
            <app-button
              v-if="nextArticleId"
              :to="nextArticleId"
              tag="nuxt-link"
              class="article"
              :text="$t('nextArticle')"/>
          </li>
        </ul>
      </nav>
      <nav aria-label="navigation">
        <nav-control/>
      </nav>
    </div>
  </header>
</template>
<script>
/* eslint-disable  max-lines */
  import AppButton from '@/components/AppButton/AppButton'
  import NavControl from '@/components/AppHeader/NavControl/NavControl'

  export default {
    name: 'AppHeader',
    components: { NavControl, AppButton },
    data: () => ({
      otherUrl: '',
      showNavbar: true,
      lastScrollPosition: 0,
      isArticlePage: false,
      articleId: null,
      previousArticleId: null,
      nextArticleId: null,
    }),
    mounted() {
      window.addEventListener('scroll', this.onScroll)
      this.isArticlePage = window.location.pathname.includes('/articles/')
      console.log('this.isArticlePage:', this.isArticlePage)
      if (this.isArticlePage) {
        // eslint-disable-next-line prefer-destructuring
        this.articleId = window.location.pathname.split('/articles/')[1].split('/')[0]
        this.previousArticleId = this.articleId !== '1' ? `/articles/${this.articleId - 1}` : null
        console.log('this.articleId:', this.articleId)
        this.nextArticleId = `/articles/${this.articleId - 1 + 2}`
        console.log('this.nextArticleId:', this.nextArticleId)
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      onScroll() {
        // Get the current scroll position
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
        // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
        if (currentScrollPosition < 0) {
          return
        }
        // Stop executing this function if the difference between
        // current scroll position and last scroll position is less than some offset
        if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
          return
        }
        // Here we determine whether we need to show or hide the navbar
        this.showNavbar = currentScrollPosition < this.lastScrollPosition // Set the current scroll position as the last scroll position
        this.lastScrollPosition = currentScrollPosition
      },
    },
    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          home: 'Page d’accueil',
          logo: 'Logo',
          previousArticle: '<',
          nextArticle: '>',
          article: 'Article',
        },
        en: {
          home: 'Home page',
          logo: 'Logo',
          previousArticle: '<',
          nextArticle: '>',
          article: 'Article',

        },
      },
    },
  }
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background: $header-bg;
  border-bottom: 1px solid $border;
  width: 100%;
  padding-left: 0;
  position: fixed;
  z-index: 1;
}

.navbar-hidden {
  transform: translate3d(0, -100%, 0);
}

.container {
  height: 100%;
  display: flex;
  margin: 0 auto;
  justify-content: space-around;
}

.logo {
  text-decoration: none;
  font-size: 20px;
  font-weight: 900;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: serif;
  border-radius: 4px;
}

.recontact {
  color: $logo-primary;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 0;
  align-self: center;
}

.me {
  align-self: center;
  padding: 5px 5px 0;
  color: $logo-secondary;
}

.icon {
  display: block;
  height: 38px;
  margin-left: -40px;
  font-size: 8px;
  color: $logo-color;
}

.navigation {
  list-style: none;
  margin: 0;
  display: inline-flex;
  padding-left: 0;
  height: 100%;
}

.article, .article-text {
  font-family: serif;
  padding-left: 10px;
  color: $nav-color;
}

.id {
  margin-top: 20px;
}

.button.article { // used in [<] Article 85 [>]
  padding: 0 10px;
}

.button {
  background-color: $header-bg;
}

.button:hover {
  background-color: $button-hover;
}

.article, .article-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo:hover {
  border: 1px solid $logo-hover;
  padding-left: 50px;
  margin-left: -50px;
  border-radius: 10px;
}

@media only screen and (max-width: 400px) {
  .icon {
    display: none;
  }

  .logo:hover {
    padding-left: 0;
    margin-left: 0;
  }
}

@media only screen and (min-width: 640px) {
  .container {
    max-width: 500px;
    justify-content: space-between;
  }

  .recontact {
    padding-left: 8px;
  }

  .me {
    padding-right: 10px;
  }
}

@media only screen and (min-width: 992px) {
  .container {
    max-width: 716px;
  }

  .logo {
    font-size: 26px;
  }

  .logo {
    padding: 10px 0;
    margin: 0;
    border: none;
    border-radius: 0;
  }

  .article, .article-text {
    font-size: 18px;
  }

  .button.article {
    font-size: 14px;
  }
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 888px;
  }
}
</style>
