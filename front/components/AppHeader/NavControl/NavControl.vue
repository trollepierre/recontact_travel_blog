<template>
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
          :alt="$t('logo')"
          class="tdm__image"
          src="../../../static/tdm.jpg">
      </a>
    </li>
    <li>
      <app-button :hide="true"/>
    </li>
    <li class="link new-link">
      <new-mode-toggle/>
    </li>
    <li class="link dark-link">
      <dark-mode-toggle/>
    </li>
    <li class="link other-language">
      <app-button
        class="other-language"
        :text="$t('otherLanguage')"
        @click="switchLanguage"/>
    </li>
  </ul>
</template>
<script>
  import AppButton from '@/components/AppButton/AppButton'
  import DarkModeToggle from '@/components/AppHeader/NavControl/DarkModeToggle/DarkModeToggle'
  import NewModeToggle from '@/components/AppHeader/NavControl/NewModeToggle/NewModeToggle'

  export default {
    name: 'NavControl',
    components: { AppButton, DarkModeToggle, NewModeToggle },
    data: () => ({
      showNavBarButton: false,
    }),
    methods: {
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
          tdm: 'Retrouver l’ancien site du tour du monde de Pierre et Benoît',
          logo: 'Logo',
          otherLanguage: '🇬🇧',
          otherUrl: 'https://www.recontact.me',
        },
        en: {
          subscribe: 'Subscribe',
          suggestion: 'Leave a message',
          tdm: 'Go to see the former website of the world trip of Pierre and Benoît',
          logo: 'Logo',
          otherLanguage: '🇫🇷',
          otherUrl: 'https://fr.recontact.me',
        },
      },
    },
  }
</script>
<style lang="scss" scoped>

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

.button {
  background-color: $header-bg;
}

.button:hover {
  background-color: $button-hover;
}

.button.other-language { // side effect
  font-size: 24px;
  margin-top: 0;
  padding: 8px 6px 0 6px;
}

.button.other-language:hover {
  background-color: $button-hover;
}

.other-language, .dark-link, .new-link {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
}

@media only screen and (max-width: 340px) {
  .button.other-language {
    font-size: 10px;
  }
}

@media only screen and (min-width: 640px) {
  .suggestion,
  .tdm {
    display: inline-block;
  }

  .link {
    margin-left: 25px;
  }
}

@media only screen and (min-width: 640px) {
  .button.other-language {
    padding: 5px 8px 0;
  }
}
</style>
