<template>
  <header
    class="header"
    :class="{ 'navbar-hidden': !showNavbar }">
    <div class="container">
      <a
        :title="home"
        class="logo"
        href="/">
        <img
          :alt="logo"
          class="icon"
          src="../../static/mstile-150x150.png">
        <span class="recontact">Recontact</span>
        <span class="me">Me</span>
      </a>
      <nav
        v-if="isArticlePage"
        aria-label="navigation">
        <ul class="navigation">
          <li class="previous article">
            <app-button
              v-if="previousArticleId"
              :to="previousArticleId"
              tag='nuxt-link'
              class="button previous article"
              :text="$t('previousArticle')"/>
          </li>
          <li class="article-text">
            <p class="id">
              Article {{ articleId }}
            </p>
          </li>
          <li class="next article">
            <app-button
              v-if="previousArticleId"
              :to="nextArticleId"
              tag='nuxt-link'
              class="button next article"
              :text="$t('nextArticle')"/>
          </li>
        </ul>
      </nav>
      <nav aria-label="navigation">
        <ul class="navigation">
          <li
            v-if="showNavBarButton"
            class="link">
            <app-button
              class="subscribe"
              :text="$t('subscribe')"
              @click="displaySubscribeModal"/>
          </li>
          <li
            v-if="showNavBarButton"
            class="link">
            <app-button
              class="suggestion"
              :text="$t('suggestion')"
              @click="displayFeedbackModal"/>
          </li>
          <li
            v-if="showNavBarButton"
            class="link tdm">
            <a
              :title="$t('tdm')"
              class="tdm"
              href="http://worldtour.recontact.me">
              <img
                :alt="logo"
                class="tdm__image"
                src="../../static/tdm.jpg">
            </a>
          </li>
          <li class="link other-language">
            <app-button
              class="other-language"
              :text="$t('otherLanguage')"
              @click="switchLanguage"/>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
<script>
/* eslint-disable  max-lines */
  import AppButton from '~/components/AppButton/AppButton'

  export default {
    name: 'AppHeader',
    components: { AppButton },
    data: () => ({
      showNavBarButton: false,
      otherUrl: '',
      showNavbar: true,
      lastScrollPosition: 0,
      isArticlePage: false,
      articleId: null,
      previousArticleId: null,
      nextArticleId: null,
    }),
    computed: {
      home() {
        return this.$t('home')
      },
      logo() {
        return this.$t('logo')
      },
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
      this.isArticlePage = window.location.pathname.includes('/articles/')
      if (this.isArticlePage) {
        // eslint-disable-next-line prefer-destructuring
        this.articleId = window.location.pathname.split('/articles/')[1].split('/')[0]
        this.previousArticleId = this.articleId !== '1' ? `/articles/${this.articleId - 1}` : null
        this.nextArticleId = `/articles/${this.articleId - 1 + 2}`
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
      switchLanguage() {
        window.location.href = this.$t('otherUrl') + window.location.pathname
      },

      displaySubscribeModal() {
      // this.$modal.show('subscribe-modal')
      },

      displayFeedbackModal() {
      // this.$modal.show('feedback-modal')
      },
    },
    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          subscribe: 'S’abonner',
          suggestion: 'Laisser un message',
          problem: 'Un problème ?',
          tdm: 'Retrouver l’ancien site du tour du monde de Pierre et Benoît',
          home: 'Page d’accueil',
          logo: 'Logo du site',
          otherLanguage: '🇬🇧',
          otherUrl: 'https://www.recontact.me',
          previousArticle: '<',
          nextArticle: '>',
          article: 'Article',
        },
        en: {
          subscribe: 'Subscribe',
          suggestion: 'Leave a message',
          problem: 'A problem?',
          tdm: 'Go to see the former website of the world trip of Pierre and Benoît',
          home: 'Home page',
          logo: 'Logo of the site',
          otherLanguage: '🇫🇷',
          otherUrl: 'https://fr.recontact.me',
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
  padding: 0;
  margin: 10px 0;
  border-radius: 4px;
}

.recontact {
  color: $logo-primary;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 0;
  align-self: center;
}

.logo:hover .recontact {
  color: $header-bg;
}

.me {
  align-self: center;
  padding: 5px 5px 0;
  color: $logo-secondary;
}

.logo:hover .me {
  color: $header-bg;
}

.icon {
  display: block;
  height: 75px;
  padding-top: 12px;
  margin: -20px;
  padding-right: 10px;
}

.navigation {
  list-style: none;
  margin: 0;
  display: inline-flex;
  padding-left: 0;
  height: 100%;
}

.suggestion,
.tdm {
  display: none;
}

.tdm {
  display: inline-flex;
  padding: 10px;
}

.tdm__image {
  color: $tdm-color;
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

.button.other-language { // side effect
  font-size: 24px;
  margin-top: 0;
  padding: 8px 6px 0 6px;
}

.other-language, .article, .article-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media only screen and (max-width: 340px) {
  .button.other-language {
    font-size: 10px;
  }
}

@media only screen and (max-width: 400px) {
  .icon {
    display: none;
  }
}

@media only screen and (min-width: 640px) {
  .container {
    max-width: 500px;
    justify-content: space-between;
  }

  .logo:hover {
    background: $logo-hover;
    padding-right: 5px;
    border-radius: 4px;
    margin-top: 7px;
    margin-bottom: 7px;
  }

  .icon {
    display: block;
    height: 75px;
    padding-top: 10px;
    margin: -5px;
  }

  .suggestion,
  .tdm {
    display: inline-block;
  }

  .link {
    margin-left: 25px;
  }

  .recontact {
    padding-left: 0;
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

  .button.other-language {
    padding: 5px 8px 0;
  }
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 888px;
  }
}
</style>
