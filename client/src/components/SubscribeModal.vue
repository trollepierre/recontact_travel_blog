<template>
  <div class="subscribe-modal-wrapper">
    <modal class="subscribe-modal" name="subscribe-modal"
           @before-open="beforeOpen" @opened="opened" :height="315">

      <div class="subscribe-modal__header">
        <h2 class="subscribe-modal__title">{{ $t("subscribe") }}</h2>
      </div>

      <div class="subscribe-modal__body">
        <form class="subscribe-modal__form" @submit="submit">

          <p class="subscribe-modal__error" v-if="error" aria-live="polite">{{error}}</p>

          <p class="subscribe-modal__text">
            {{ $t("modalText") }}
          </p>

          <label class="subscribe-modal__label" for="subscribe-content">{{ $t("email") }}</label>
          <input class="subscribe-modal__email" id="subscribe-content" placeholder="pierre@recontact.me" v-model="email"/>
        </form>
      </div>

      <div class="subscribe-modal__footer">
        <div class="subscribe-modal__actions">
          <button class="subscribe-modal__action subscribe-modal__action--send" @click="sendSubscription">{{ $t("confirm") }}</button>
          <button class="subscribe-modal__action subscribe-modal__action--cancel" @click="cancelSubscription">{{ $t("cancel") }}</button>
        </div>
      </div>

    </modal>
  </div>
</template>

<script>
  import subscriptionsApi from '@/api/subscriptions';
  import notificationsService from '@/services/notifications';

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
        this._resetEmail();
        this._removeError();
      },

      opened() {
        this.trackEvent();
        this._focusOnInput();
        this._closeOnEscapeKey();
      },

      _closeOnEscapeKey() {
        document.addEventListener('keydown', (e) => {
          if (e.keyCode === 27) {
            this._closeModal();
          }
        });
      },

      _focusOnInput() {
        this.$el.querySelector('input#subscribe-content').focus();
      },

      sendSubscription() {
        this._removeError();
        /* eslint-disable no-useless-escape */
        const regex = new RegExp('^[_A-Za-z0-9-\+-]+(\.[_A-Za-z0-9-\+-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-\+-]+)*(\.[A-Za-z]{2,})$');
        if (!regex.exec(this.email)) {
          this.error = this.$t('emailError');
          return;
        }

        subscriptionsApi.subscribe(this.email)
          .then(this.displaySuccessNotification)
          .then(this._closeModal)
          .catch(() => {
            this.error = this.$t('subscriptionError');
          });
      },

      displaySuccessNotification() {
        notificationsService.success(this, this.$t('subscriptionSuccess'));
      },

      cancelSubscription() {
        this._closeModal();
      },

      _resetEmail() {
        this.email = null;
      },

      _removeError() {
        this.error = null;
      },

      _closeModal() {
        this.$modal.hide('subscribe-modal');
      },

      submit(e) {
        e.preventDefault();
        this.sendSubscription();
      },

      trackEvent() {
        this.$ga.event({
          eventCategory: 'Subscribe Modal',
          eventAction: 'open',
          eventLabel: 'Subscribe modal is opened',
          eventValue: null,
        });
      },
    },
    i18n: {
      messages: {
        fr: {
          subscribe: 'S‘abonner',
          modalText: 'Recevoir un email à chaque nouvel article du voyage !',
          email: 'Email :',
          confirm: 'Confirmer',
          cancel: 'Annuler',
          emailError: 'Vous devez saisir un email valide. (ex. : nom@exemple.fr)',
          subscriptionError: 'Erreur lors de la prise en compte de ton abonnement.',
          subscriptionSuccess: 'Ton abonnement aux alertes de Recontact Me a été pris en compte.',
        },
        en: {
          subscribe: 'Subscribe',
          modalText: 'Receive one email for each new article.',
          email: 'Email:',
          confirm: 'Confirm',
          cancel: 'Cancel',
          emailError: 'Please insert a valid email (ex. : name@example.com)',
          subscriptionError: 'Error during the subscription.',
          subscriptionSuccess: 'Your subscription to Recontact Me alerts has been taken into consideration.',
        },
      },
    },
  };

</script>

<style scoped>
  .subscribe-modal__header {
    background-color: #eef0f4;
    padding: 10px 20px;
    justify-content: center;
    display: flex;
  }

  .subscribe-modal__body {
    padding: 25px 20px;
    background: #fff;
    height: 125px;
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

  .subscribe-modal__email {
    width: 250px;
    font-size: 16px;
  }

  .subscribe-modal__text {
    width: 100%;
    resize: none;
    overflow: auto;
    height: 30px;
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
