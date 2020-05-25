<template>
  <header class="header">
    <div class="container">
      <a
        :title="home"
        class="logo"
        href="/">
        <span class="recontact">Recontact</span>
        <span class="me">Me</span>
        <img
          :alt="logo"
          class="icon"
          src="../../static/mstile-150x150.png">
      </a>
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
  .header {
    height: 60px;
    background: #FFFFFF;
    border-bottom: 1px solid #E6E6E6;
    width: 100%;
    padding-left: 0;
  }

  .container {
    height: 100%;
    display: flex;
    margin: 0 auto;
    justify-content: space-around;
  }

  .logo {
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
    color: #07C;
    padding: 5px 5px 0;
    align-self: center;
  }

  .me {
    align-self: center;
    padding: 5px 5px 0;
    color: #F48024;
  }

  .icon {
    display: none;
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

  .button.other-language {
    line-height: 28px;
    color: #F48024;
    text-decoration: unset;
    font-size: 14px;
    font-family: serif;
    text-transform: uppercase;
    background: #FFFFFF;
    border: 1px solid #F48024;
    cursor: pointer;
    padding: 5px 15px 3px;
    border-radius: 4px;
    width: 100%;
    font-weight: 700;
  }

  .button.other-language:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .tdm {
    padding: 10px;
  }

  .other-language {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media only screen and (min-width: 640px) {
    .container {
      max-width: 500px;
      justify-content: space-between;
    }

    .icon {
      display: block;
      height: 75px;
      padding-top: 10px;
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
  }

  @media only screen and (min-width: 1200px) {
    .container {
      max-width: 888px;
    }
  }
</style>
