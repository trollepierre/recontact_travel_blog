<template>
  <div class="feedback-modal-wrapper">
    <modal
      :height="heightModal"
      class="feedback-modal"
      name="feedback-modal"
      @before-open="beforeOpen"
      @opened="opened">
      <div class="feedback-modal__header">
        <h2 class="feedback-modal__title">
          {{ $t("suggest") }}
        </h2>
      </div>

      <div class="feedback-modal__body">
        <form
          class="feedback-modal__form"
          @submit="submit">
          <p
            v-if="error"
            class="feedback-modal__error"
            aria-live="polite">
            {{ error }}
          </p>

          <label
            class="feedback-modal__label"
            for="feedback-email">
            {{ $t("email") }}
          </label>
          <input
            id="feedback-email"
            v-model="email"
            class="feedback-modal__email"
            placeholder="pierre@recontact.me">

          <label
            class="feedback-modal__label"
            for="feedback-content">
            {{ $t("content") }}
          </label>
          <textarea
            id="feedback-content"
            v-model="feedback"
            :placeholder="placeholder"
            :style="{height: heightMessage}"
            class="feedback-modal__text"
            @keyup.shift.enter="sendFeedback"/>
        </form>
      </div>

      <div class="feedback-modal__footer">
        <div class="feedback-modal__actions">
          <button
            class="feedback-modal__action feedback-modal__action--send"
            @click.prevent="sendFeedback">
            {{ $t("send") }}
          </button>
          <button
            class="feedback-modal__action feedback-modal__action--cancel"
            @click.prevent="cancelFeedback">
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import feedbacksApi from '../../api/feedbacks'
  import notificationsService from '../../services/notifications'
  import { PHONE_PORTRAIT_TO_LANDSCAPE, screenHeight } from '../../utils/screen/screen-utils'

  export default {
    name: 'FeedbackModal',
    data() {
      return {
        email: null,
        feedback: null,
        error: null,
        placeholder: this.$t('placeholder'),
      }
    },
    computed: {
      heightMessage() {
        return screenHeight < PHONE_PORTRAIT_TO_LANDSCAPE ? undefined : '152px'
      },
      heightModal() {
        return screenHeight < PHONE_PORTRAIT_TO_LANDSCAPE ? 280 : 415
      },
    },
    methods: {
      beforeOpen() {
        this._resetFeedback()
        this._resetEmail()
        this._resetHeight()
        this._removeError()
      },

      opened() {
        this.trackEvent()
        this._focusOnInput()
        this._closeOnEscapeKeyOrOrientationChange()
      },

      _closeOnEscapeKeyOrOrientationChange() {
        window.addEventListener('orientationchange', this._closeModal)
        document.addEventListener('keydown', e => {
          if (e.keyCode === 27) {
            this._closeModal()
          }
        })
      },

      _focusOnInput() {
        this.$el.querySelector('input#feedback-email').focus()
      },

      sendFeedback() {
        this._removeError()
        /* eslint-disable no-useless-escape */
        const regex = new RegExp('^[_A-Za-z0-9-\+-]+(\.[_A-Za-z0-9-\+-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-\+-]+)*(\.[A-Za-z]{2,})$')
        if (!regex.exec(this.email)) {
          this.error = this.$t('emailError')
          this._setErrorHeight()
          return
        }
        if (!this.feedback || this.feedback.trim().length === 0) {
          this.error = this.$t('feedbackError')
          this._setErrorHeight()
          return
        }
        feedbacksApi.sendFeedback(this.feedback, this.email)
          .then(this.displaySuccessNotification)
          .then(() => this._closeModal())
          .catch(() => {
            this.error = this.$t('sendingError')
            this._setErrorHeight()
          })
      },

      trackEvent() {
        this.$ga.event({
          eventCategory: 'Feedback Modal',
          eventAction: 'open',
          eventLabel: 'Feedback modal is opened',
        })
      },

      cancelFeedback() {
        this._closeModal()
      },

      displaySuccessNotification() {
        notificationsService.success(this, this.$t('sendingSuccess'))
      },

      _resetFeedback() {
        this.feedback = null
      },

      _resetEmail() {
        this.email = null
      },

      _resetHeight() {
        this.heightMessage = '152px'
      },

      _setErrorHeight() {
        this.heightMessage = '90px'
      },

      _removeError() {
        this.error = null
      },

      _closeModal() {
        this.$modal.hide('feedback-modal')
      },

      submit(e) {
        e.preventDefault()
        this.sendFeedback()
      },
    },

    i18n: {
      messages: {
        fr: {
          suggest: 'Laisser un message',
          content: 'Contenu du message  :',
          placeholder: 'Votre message ici',
          email: 'Email  :',
          send: 'Envoyer',
          cancel: 'Annuler',
          emailError: 'Vous devez saisir un email valide. (ex. : nom@exemple.fr)',
          feedbackError: 'Vous devez saisir un message.',
          sendingError: 'Une erreur est survenue durant l\'envoi du message.',
          sendingSuccess: 'Ton message a été envoyé.',
        },
        en: {
          suggest: 'Leave a message',
          content: 'Message:',
          placeholder: 'Your message here',
          email: 'Email:',
          send: 'Send',
          cancel: 'Cancel',
          emailError: 'Please insert a valid email (ex. : name@example.com)',
          feedbackError: 'Please insert a message',
          sendingError: 'Error when sending the message.',
          sendingSuccess: 'Your message has been sent.',
        },
      },
    },
  }

</script>

<style scoped>
  .feedback-modal__header {
    background-color: #eef0f4;
    padding: 10px 20px;
    justify-content: center;
    display: flex;
  }

  .feedback-modal__body {
    padding: 10px 20px;
    background: #fff;
    height: 135px;
  }

  .feedback-modal__form {
    padding: 0;
    margin: 0;
  }

  .feedback-modal__title {
    margin: 0;
    font-size: 24px;
    color: #333333;
    height: 40px;
    line-height: 40px;
  }

  .feedback-modal__error {
    background-color: #ea6344;
    color: white;
    border-radius: 3px;
    padding: 10px;
    margin: 0 0 20px;
  }

  .feedback-modal__email {
    width: 250px;
    font-size: 16px;
    margin-bottom: 15px;
  }

  .feedback-modal__label {
    display: block;
    margin-bottom: 10px;
  }

  .feedback-modal__text {
    width: 100%;
    border: 1px solid #d8dde6;
    resize: none;
    overflow: auto;
    font-size: 16px;
    box-sizing: border-box;
    padding: 5px;
  }

  .feedback-modal__footer {
    padding: 20px;
    background: #fff;
    text-align: right;
  }

  .feedback-modal__action {
    display: inline-block;
    padding: 4px 15px;
    font-size: 14px;
    line-height: 16px;
    color: #fff;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    background: #008a00;
    outline: none;
    border: none;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    height: 34px;
    font-weight: 500;
    margin: 0;
  }

  .feedback-modal__action:focus {
    border: 3px #000000 solid;
  }

  .feedback-modal__action:hover {
    opacity: .85;
  }

  .feedback-modal__action--cancel {
    background: #fff;
    border: 1px solid #d8dde6;
    color: #333333;
  }

  .feedback-modal__action--cancel:hover {
    box-shadow: 0 0 3px 0 #d8dde6;
  }

  @media only screen and (min-height: 640px) {
    .feedback-modal__body {
      height: 245px;
    }
  }
</style>
