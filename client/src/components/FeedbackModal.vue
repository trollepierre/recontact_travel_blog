<template>
  <div class="feedback-modal-wrapper">
    <modal class="feedback-modal" name="feedback-modal" @before-open="beforeOpen" :height="415">

      <!-- modal header-->
      <div class="feedback-modal__header">
        <h2 class="feedback-modal__title">Laisser un message</h2>
      </div>

      <!-- modal body -->
      <div class="feedback-modal__body">
        <form class="feedback-modal__form">
          <p class="feedback-modal__error" v-if="error" aria-live="polite">{{error}}</p>

          <label class="feedback-modal__label" for="subscribe-content">Email :</label>
          <input class="feedback-modal__email" id="subscribe-content" v-model="email"/>

          <label class="feedback-modal__label" for="feedback-content">Contenu du message :</label>
          <textarea class="feedback-modal__text" id="feedback-content" v-model="feedback"
                    :style="{height: heightMessage}"></textarea>
        </form>
      </div>

      <!-- modal footer -->
      <div class="feedback-modal__footer">
        <div class="feedback-modal__actions">
          <button class="feedback-modal__action feedback-modal__action--send" @click.prevent="sendFeedback">Envoyer
          </button>
          <button class="feedback-modal__action feedback-modal__action--cancel" @click.prevent="cancelFeedback">
            Annuler
          </button>
        </div>
      </div>

    </modal>
  </div>
</template>

<script>
  import feedbacksApi from '@/api/feedbacks';
  import notificationService from '@/services/notification';

  export default {
    name: 'FeedbackModal',
    data() {
      return {
        email: null,
        feedback: null,
        error: null,
        heightMessage: '152px',
      };
    },
    methods: {
      beforeOpen() {
        this._resetFeedback();
        this._resetEmail();
        this._resetHeight();
        this._removeError();
      },

      sendFeedback() {
        this._removeError();
        /* eslint-disable no-useless-escape */
        const regex = new RegExp('^[_A-Za-z0-9-\+-]+(\.[_A-Za-z0-9-\+-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-\+-]+)*(\.[A-Za-z]{2,})$');
        if (!regex.exec(this.email)) {
          this.error = 'Vous devez saisir un email valide. (ex. : nom@exemple.fr)';
          this._setErrorHeight();
          return;
        }
        if (!this.feedback || this.feedback.trim().length === 0) {
          this.error = 'Vous devez saisir un message.';
          this._setErrorHeight();
          return;
        }
        feedbacksApi.sendFeedback(this.feedback, this.email)
          .then(this.displaySuccessNotification)
          .then(() => this._closeModal())
          .catch(() => {
            this.error = 'Une erreur est survenue durant l\'envoi du message.';
            this._setErrorHeight();
          });
      },

      cancelFeedback() {
        this._closeModal();
      },

      displaySuccessNotification() {
        const message = 'Ton message a été envoyé.';
        notificationService.success(this, message);
      },

      _resetFeedback() {
        this.feedback = null;
      },

      _resetEmail() {
        this.email = null;
      },

      _resetHeight() {
        this.heightMessage = '152px';
      },

      _setErrorHeight() {
        this.heightMessage = '90px';
      },

      _removeError() {
        this.error = null;
      },

      _closeModal() {
        this.$modal.hide('feedback-modal');
      },
    },
  };

</script>

<style scoped>
  .feedback-modal__header {
    background-color: #eef0f4;
    padding: 10px 20px;
    justify-content: center;
    display: flex;
  }

  .feedback-modal__body {
    padding: 25px 20px;
    background: #fff;
    height: 216px;
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
</style>
