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
            <button
              class="button previous article"
              type="button"
              @click.prevent="viewPreviousArticle">
              {{ $t("previousArticle") }}
            </button>
          </li>
          <li class="article-text">
            <p class="id">Article {{ articleId }}</p>
          </li>
          <li class="next article">
            <button
              class="button next article"
              type="button"
              @click.prevent="viewNextArticle">
              {{ $t("nextArticle") }}
            </button>
          </li>
        </ul>
      </nav>
      <nav aria-label="navigation">
        <ul class="navigation">
          <li
            v-if="showNavBarButton"
            class="link">
            <button
              class="button subscribe"
              type="button"
              @click.prevent="displaySubscribeModal">
              {{ $t("subscribe") }}
            </button>
          </li>
          <li
            v-if="showNavBarButton"
            class="link">
            <button
              class="button suggestion"
              type="button"
              @click.prevent="displayFeedbackModal">
              {{ $t("suggestion") }}
            </button>
          </li>
          <li
            v-if="showNavBarButton"
            class="link tdm">
            <a
              :title="tdm"
              class="button tdm"
              href="http://worldtour.recontact.me">
              <img
                :alt="logo"
                class="tdm__image"
                src="../../static/tdm.jpg">
            </a>
          </li>
          <li class="link other-language">
            <button
              class="button other-language"
              type="button"
              @click.prevent="switchLanguage">
              {{ $t("otherLanguage") }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
<script>
  export default {
    name: 'AppHeader',
    data: () => ({
      showNavBarButton: false,
      otherUrl: '',
      showNavbar: true,
      lastScrollPosition: 0,
    }),
    computed: {
      isArticlePage() {
        return process.client ? window.location.pathname.includes('/articles/') : false
      },
      articleId() {
        return this.isArticlePage ? window.location.pathname.split('/articles/')[1] : null
      },
      tdm() {
        return this.$t('tdm')
      },
      home() {
        return this.$t('home')
      },
      logo() {
        return this.$t('logo')
      },
      otherLanguage() {
        return this.$t('otherLanguage')
      },
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      viewPreviousArticle() {
        if (this.articleId > 1) {
          this.goToArticle(this.articleId - 1)
        }
      },
      viewNextArticle() {
        this.goToArticle(this.articleId - 1 + 2)
      },
      goToArticle(idArticle) {
        this.$router.push(`/articles/${idArticle}`)
      },
      onScroll() {
        // Get the current scroll position
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
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

<style scoped>
  .header {
    height: 60px;
    background: #FFFFFF;
    border-bottom: 1px solid #E6E6E6;
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
  }

  .logo {
    padding: 0;
    margin: 10px 0;
    border-radius: 4px;
  }

  .recontact {
    color: #07C;
    padding-top: 5px;
    padding-left: 5px;
    padding-bottom: 0;
    align-self: center;
  }

  .me {
    align-self: center;
    padding: 5px 5px 0;
    color: #F48024;
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
  }

  .tdm__image {
    color: darkgrey;
  }

  .article, .article-text {
    font-family: serif;
    padding-left: 10px;
    color: #F48024;
  }

  .button.article:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .button.article {
    padding: 0 10px;
  }

  .id {
    margin-top: 20px;
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

  .button.other-language {
    font-size: 24px;
    margin-top: 0;
    padding: 8px 6px 0 6px;
  }

  .button.other-language:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .tdm {
    padding: 10px;
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
      background: #D14800;
      color: #FFFFFF;
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

    .button {
      font-size: 14px;
      padding: 5px 15px 3px;
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
