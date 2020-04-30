<template>
  <header class="page__header">
    <div class="page__container">
      <a
        :title="home"
        class="logo-link"
        href="/">
        <span class="recontact">Recontact</span>
        <span class="me">Me</span>
      </a>
      <nav aria-label="site navigation">
        <ol class="navigation__links">
          <li
            v-if="showNavBarButton"
            class="navigation__link">
            <button
              class="navbar-action navbar-action__subscribe"
              type="button"
              @click.prevent="displaySubscribeModal">
              {{ $t("subscribe") }}
            </button>
          </li>
          <li
            v-if="showNavBarButton"
            class="navigation__link">
            <button
              class="navbar-action navbar-action__suggestion"
              type="button"
              @click.prevent="displayFeedbackModal">
              {{ $t("suggestion") }}
            </button>
          </li>
          <li
            v-if="showNavBarButton"
            class="navigation__link tdm">
            <a
              :title="tdm"
              class="navbar-action navbar-action__tdm"
              href="http://worldtour.recontact.me">
              <img
                :alt="logo"
                class="tdm__image"
                src="/static/tdm.jpg">
            </a>
          </li>
          <li class="navigation__link other-language">
            <button
              class="navbar-action navbar-action__other-language"
              type="button"
              @click.prevent="switchLanguage">
              {{ $t("otherLanguage") }}
            </button>
          </li>
        </ol>
      </nav>
    </div>
  </header>
</template>
<script>
  import { isWww } from '../../services'

  export default {
    name: 'AppHeader',
    data: () => ({ showNavBarButton: false, otherUrl: '' }),
    computed: {
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
      if (navigator.language.substring(0, 2) === 'fr' && isWww()) {
        alert('La version française du blog est désormais disponible sur https://fr.recontact.me, cliquez sur le lien en haut à droite pour retrouver le blog en français.')
      }
    },
    methods: {
      switchLanguage() {
        window.location = this.$t('otherUrl') + window.location.pathname
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
          otherLanguage: 'English Blog',
          otherUrl: 'https://www.recontact.me',
        },
        en: {
          subscribe: 'Subscribe',
          suggestion: 'Leave a message',
          problem: 'A problem?',
          tdm: 'Go to see the former website of the world trip of Pierre and Benoît',
          home: 'Home page',
          logo: 'Logo of the site',
          otherLanguage: 'Blog en Français',
          otherUrl: 'https://fr.recontact.me',
        },
      },
    },
  }
</script>

<style scoped>
  .page__header {
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    width: 100%;
    padding-left: 0;
  }

  .page__container {
    height: 100%;
    display: flex;
    margin: 0 auto;
    justify-content: space-around;
  }

  .logo-link {
    text-decoration: none;
    font-size: 26px;
    font-weight: 900;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-family: serif;

  }

  .recontact {
    color: #07c;
    padding: 5px 5px 0;
    align-self: center;
  }

  .me {
    align-self: center;
    padding: 5px 5px 0;
    color: #F48024;
  }

  .navbar-action {
    cursor: pointer;
    background: transparent;
    font-size: 16px;
    border: none;
    padding: 16px 0;
    line-height: 28px;
    color: #333333;
    display: inline-block;
  }

  .navbar-action:hover {
    background: #d14800;
    color: #ffffff;
  }

  .navbar-action__suggestion,
  .navbar-action__tdm {
    display: none;
  }

  .navigation__links {
    list-style: none;
    margin: 0;
    display: inline-flex;
  }

  .tdm {
    display: inline-flex;
  }

  .navbar-action__other-language {
    color: #F48024;
    text-decoration: unset;
    font-size: 14px;
    font-family: serif;
    text-transform: uppercase;
    background: #ffffff;
    border: 1px solid #F48024;
    cursor: pointer;
    padding: 5px 15px 3px;
    border-radius: 4px;
    width: 100%;
    font-weight: 700;
  }

  .navbar-action__tdm {
    padding: 10px;
  }

  .other-language {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .navigation__links {
    padding-left: 0;
    height: 100%;
  }

  @media only screen and (min-width: 640px) {
    .page__container {
      justify-content: space-between;
    }

    .navbar-action__suggestion,
    .navbar-action__tdm {
      display: inline-block;
    }

    .navigation__link {
      margin-left: 25px;
    }

    .recontact {
      color: #07c;
      padding-left: 0;
    }
  }

  @media only screen and (min-width: 640px) {
    .page__container {
      max-width: 500px;
    }
  }

  @media only screen and (min-width: 992px) {
    .page__container {
      max-width: 716px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .page__container {
      max-width: 888px;
    }
  }
</style>
