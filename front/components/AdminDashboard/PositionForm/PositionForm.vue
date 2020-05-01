<template>
  <form class="position__form">
    <p class="position__text">
      {{ $t("lastPosition") }}
    </p>
    <span class="form-group">
      <label
        class="position__label"
        for="position-place">
        {{ $t("place") }}
      </label>
      <input
        id="position-place"
        v-model="place"
        class="position__input position__place"
        placeholder="Paris">
    </span>
    <span class="form-group">
      <label
        class="position__label"
        for="position-time">
        {{ $t("time") }}
      </label>
      <input
        id="position-time"
        v-model="time"
        class="position__input position__time"
        placeholder="le 1er mai 2018">
    </span>
    <button
      type="submit"
      class="position__button position__action--send"
      @click.prevent="updateLastPosition">
      {{ $t("confirm") }}
    </button>
  </form>
</template>
<script>
  import positionsApi from '../../../services/api/positions'
  import notificationsService from '../../../services/services/notifications'

  export default {
    name: 'PositionForm',
    data() {
      return {
        place: null,
        time: null,
      }
    },
    methods: {
      submit(e) {
        e.preventDefault()
        this.updateLastPosition()
      },
      updateLastPosition() {
        if (this.place === null || this.time === null) {
          this.displayErrorMessage()
        } else {
          const position = {
            place: this.place,
            time: this.time,
          }
          positionsApi.add(position)
            .then(this.updateLastPositionData)
            .then(this.displaySuccessMessage)
        }
      },
      updateLastPositionData() {
        this.$emit('updateLastPositionData', { place: this.place, time: this.time })
        this.resetPosition()
      },
      resetPosition() {
        this.place = null
        this.time = null
      },
      displayErrorMessage() {
        notificationsService.error(this, this.$t('positionNotUpdated'))
      },
      displaySuccessMessage() {
        notificationsService.success(this, this.$t('positionUpdated'))
      },
    },

    i18n: {
      messages: {
        fr: {
          place: 'Position  :',
          time: 'Date  :',
          lastPosition: 'Nouvelle position  :',
          confirm: 'Envoyer',
          lastKnownPosition: 'Dernière position connue  :',
          positionUpdated: 'Position mise-à-jour',
          positionNotUpdated: 'Renseigne toutes les informations. La position n\'a pas été mise-à-jour',
        },
        en: {
          place: 'Position:',
          time: 'Date:',
          lastPosition: 'New position:',
          confirm: 'Confirm',
          lastKnownPosition: 'Last known position:',
          positionUpdated: 'Position updated',
          positionNotUpdated: 'Fill all the informations. Position was not updated',
        },
      },
    },
  }
</script>
<style scoped>
  .form-group {
    text-align: right;
    margin-right: 30px;
    float: right;
  }

  .position__input {
    background: #FFFFFF;
    border: 1px solid cadetblue;
    padding: 15px 10px;
    border-radius: 4px;
    width: 230px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .position__button {
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

  .position__button:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .position__button:disabled {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }

  @media only screen and (min-width: 640px) {
    .form-group {
      text-align: left;
      float: left;
    }
  }

  @media only screen and (min-width: 540px) and (max-width: 992px){
    .position__form {
      margin-bottom: 60px;
    }
  }
</style>
