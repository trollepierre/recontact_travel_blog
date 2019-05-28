<template>
  <div class="admin-dashboard">
    <button
      class="dashboard__buttons dashboard__sync_hidden"
      type="button"
      @click.prevent="goToSubscriptions">
      {{ $t("getSubscribers") }}
    </button>
    <button
      :disabled="isClickedSync"
      class="dashboard__buttons"
      type="button"
      @click.prevent="synchronise">
      {{ $t("getNewArticles") }}
    </button>
    <button
      :disabled="isClickedSync"
      class="dashboard__buttons dashboard__sync_hidden"
      type="button"
      @click.prevent="deleteAll">
      {{ $t("deleteAllArticles") }}
    </button>
    <button
      :disabled="isClickedSync"
      class="dashboard__buttons dashboard__sync_hidden"
      type="button"
      @click.prevent="deleteAndSyncAll">
      {{ $t("deleteAndSyncAllArticles") }}
    </button>
    <br>
    <position-form @updateLastPositionData="updateLastPositionData"/>
  </div>
</template>
<script>
  import notificationsService from '../../services/notifications'
  import syncApi from '../../api/sync'
  import PositionForm from './position-form/PositionForm.vue'
  import articlesApi from '../../api/articles'

  export default {
    name: 'AdminDashboard',
    components: { PositionForm },
    data() {
      return {
        isClickedSync: false,
      }
    },
    methods: {
      updateLastPositionData(position) {
        this.$emit('updateLastPositionData', position)
      },

      disableButton() {
        this.isClickedSync = true
      },

      enableButton() {
        this.isClickedSync = false
      },

      synchronise() {
        this.trackEvent()
        this.disableButton()
        notificationsService.information(this, this.$t('syncLaunched'))
        syncApi.launch()
          .then(() => {
            notificationsService.removeInformation(this)
            notificationsService.success(this, this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.removeInformation(this)
            notificationsService.error(this, `${this.$t('syncError')} ${err}`)
          })
      },

      deleteAll() {
        this.disableButton()
        notificationsService.information(this, this.$t('syncLaunched'))
        articlesApi.deleteAll()
          .then(() => {
            notificationsService.removeInformation(this)
            notificationsService.success(this, this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.removeInformation(this)
            notificationsService.error(this, `${this.$t('syncError')} ${err}`)
          })
      },

      deleteAndSyncAll() {
        this.disableButton()
        notificationsService.information(this, this.$t('syncLaunched'))
        articlesApi.deleteAndSyncAll()
          .then(() => {
            notificationsService.removeInformation(this)
            notificationsService.success(this, this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.removeInformation(this)
            notificationsService.error(this, `${this.$t('syncError')} ${err}`)
          })
      },

      goToSubscriptions() {
        this.$router.push('/subscriptions')
      },

      trackEvent() {
        this.$ga.event({
          eventCategory: 'Article List',
          eventAction: 'synchronise',
          eventLabel: 'All articles have been synchronised',
        })
      },

      goToHome() {
        this.enableButton()
        this.$router.push('/')
      },
    },
    i18n: {
      messages: {
        fr: {
          getNewArticles: 'Récupérer les nouveaux articles',
          deleteAllArticles: 'Supprimer tous les articles',
          deleteAndSyncAllArticles: 'Supprimer & synchro tous les articles',
          getSubscribers: 'Récupérer les abonnés de Recontact.me',
          syncLaunched: 'La synchronisation est lancée ! Patientez quelques secondes...',
          syncDone: 'La synchronisation s’est effectuée sans problème&nbsp!',
          syncError: 'Erreur : Problème durant la synchronisation&nbsp:',
        },
        en: {
          getNewArticles: 'Synchronise the new articles',
          deleteAllArticles: 'Delete all articles',
          deleteAndSyncAllArticles: 'Delete and synchronise all articles',
          getSubscribers: 'Get the subscribers',
          syncLaunched: 'The synchronisation is launched! Please wait...',
          syncDone: 'The synchronisation succeeds!',
          syncError: 'Error during the synchronisation:',
        },
      },
    },
  }
</script>
<style scoped>
  .dashboard__buttons {
    text-transform: uppercase;
    color: #f76252;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 230px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .dashboard__sync_hidden {
    color: #f7b5a9;
  }

  .dashboard__buttons:hover {
    background: #d14800;
    color: #ffffff;
  }

  .dashboard__buttons:disabled {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }
</style>
