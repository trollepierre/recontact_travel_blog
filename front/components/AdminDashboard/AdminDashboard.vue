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
      @click.prevent="updateAll">
      {{ $t("updateAllArticles") }}
    </button>
    <label for="min">min</label>
    <input
      id="min"
      v-model="min"
      :placeholder="1">
    <label for="max">max</label>
    <input
      id="max"
      v-model="max"
      :placeholder="87">
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
  import notificationsService from '../../services/services/notifications'
  import syncApi from '../../services/api/sync'
  import PositionForm from './PositionForm/PositionForm.vue'
  import articlesApi from '../../services/api/articles'

  export default {
    name: 'AdminDashboard',
    components: { PositionForm },
    data() {
      return {
        isClickedSync: false,
        min: 1,
        max: 100,
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
        this.disableButton()
        notificationsService.information(this.$t('syncLaunched'))
        syncApi.launch()
          .then(() => {
            notificationsService.information(this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.error(`${this.$t('syncError')} ${err}`)
          })
      },

      updateAll() {
        this.disableButton()
        notificationsService.information(this.$t('syncLaunched'))
        articlesApi.updateAll(this.min, this.max)
          .then(() => {
            notificationsService.information(this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.error(`${this.$t('syncError')} ${err}`)
          })
      },

      deleteAll() {
        this.disableButton()
        notificationsService.information(this.$t('syncLaunched'))
        articlesApi.deleteAll()
          .then(() => {
            notificationsService.information(this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.error(`${this.$t('syncError')} ${err}`)
          })
      },

      deleteAndSyncAll() {
        this.disableButton()
        notificationsService.information(this.$t('syncLaunched'))
        articlesApi.deleteAndSyncAll()
          .then(() => {
            notificationsService.information(this.$t('syncDone'))
          })
          .then(() => this.goToHome())
          .catch(err => {
            notificationsService.error(`${this.$t('syncError')} ${err}`)
          })
      },

      goToSubscriptions() {
        this.$router.push('/subscriptions')
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
          updateAllArticles: 'Réparer tous les articles',
          deleteAndSyncAllArticles: 'Supprimer & synchro tous les articles',
          getSubscribers: 'Récupérer les abonnés de Recontact.me',
          syncLaunched: 'La synchronisation est lancée ! Patientez quelques secondes...',
          syncDone: 'La synchronisation s’est effectuée sans problème  !',
          syncError: 'Erreur : Problème durant la synchronisation  :',
        },
        en: {
          getNewArticles: 'Synchronise the new articles',
          deleteAllArticles: 'Delete all articles',
          updateAllArticles: 'Repare all articles',
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
    background: #FFFFFF;
    border: 1px solid #D14800;
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
    background: #D14800;
    color: #FFFFFF;
  }

  .dashboard__buttons:disabled {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }
</style>
