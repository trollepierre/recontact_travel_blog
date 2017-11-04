<template>
  <div class="subscribe-modal-wrapper">
    <modal class="subscribe-modal" name="subscribe-modal" @before-open="beforeOpen" :height="415">

      <!-- modal header-->
      <div class="subscribe-modal__header">
        <h2 class="subscribe-modal__title">S'abonner</h2>
      </div>

      <!-- modal body -->
      <div class="subscribe-modal__body">
        <form class="subscribe-modal__form">

          <p class="subscribe-modal__error" v-if="error" aria-live="polite">{{error}}</p>

          <label class="subscribe-modal__label" for="subscribe-content">Email :</label>
          <input class="subscribe-modal__email" id="subscribe-content" v-model="email"/>
        </form>
      </div>

      <!-- modal footer -->
      <div class="subscribe-modal__footer">
        <div class="subscribe-modal__actions">
          <button class="subscribe-modal__action subscribe-modal__action--send" @click="sendSubscription">Envoyer</button>
          <button class="subscribe-modal__action subscribe-modal__action--cancel" @click="cancelSubscription">Annuler</button>
        </div>
      </div>

    </modal>
  </div>
</template>

<script>
  import subscriptionsApi from '@/api/subscriptions';
  import notificationService from '@/services/notification';

  export default {
    name: 'SubscribeModal',
    data() {
      return {
        email: null,
        error: null,
      };
    },
    methods: {
      beforeOpen() {
        this._resetFeedback();
        this._removeError();
      },

      sendSubscription() {
        this._removeError();
        if (!this.email || this.email.trim().length === 0) {
          // todo check email pattern
          this.error = 'Vous devez saisir un email.';
          return;
        }

        subscriptionsApi.subscribe(this.email)
          .then(this.displaySuccessNotification)
          .then(this._closeModal)
          .catch(() => {
            this.error = 'Erreur lors de la prise en compte de ton abonnement.';
          });
      },

      displaySuccessNotification() {
        const message = 'Ton abonnement aux alertes de Recontact Me a été pris en compte.';
        notificationService.success(this, message);
      },

      cancelSubscription() {
        this._closeModal();
      },

      _resetFeedback() {
        this.subscribe = null;
      },

      _removeError() {
        this.error = null;
      },

      _closeModal() {
        this.$modal.hide('subscribe-modal');
      },
    },
  };

</script>

<style scoped>
  .subscribe-modal__header {
    background-color: #eef0f4;
    padding: 10px 20px;
    justify-content: center;
    display: flex;  }

  .subscribe-modal__body {
    padding: 25px 20px;
    background: #fff;
    height: 216px;
  }

  .subscribe-modal__form {
    padding: 0;
    margin: 0;
  }

  .subscribe-modal__title {
    margin: 0;
    font-size: 24px;
    color: #333333;
    height: 40px;
    line-height: 40px;
  }

  .subscribe-modal__error {
    background-color: #ea6344;
    color: white;
    border-radius: 3px;
    padding: 10px;
    margin: 0 0 20px;
  }

  .subscribe-modal__label {
    display: block;
    margin-bottom: 10px;
  }

  .subscribe-modal__text {
    width: 100%;
    border: 1px solid #d8dde6;
    resize: none;
    overflow: auto;
    height: 152px;
    font-size: 16px;
    box-sizing: border-box;
    padding: 5px;
  }

  .subscribe-modal__footer {
    padding: 20px;
    background: #fff;
    text-align: right;
  }

  .subscribe-modal__action {
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

  .subscribe-modal__action:focus {
    border: 3px #000000 solid;
  }

  .subscribe-modal__action:hover {
    opacity: .85;
  }

  .subscribe-modal__action--cancel {
    background: #fff;
    border: 1px solid #d8dde6;
    color: #333333;
  }

  .subscribe-modal__action--cancel:hover {
    box-shadow: 0 0 3px 0 #d8dde6;
  }
</style>
