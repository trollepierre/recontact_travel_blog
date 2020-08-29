<template>
  <form class="position__form">
    <span class="position__language">
      <p class="positionFr__text">
        {{ $t("lastPositionFr") }}
      </p>
      <span class="form-group">
        <label
          class="position__label"
          for="positionFr-place">
          {{ $t("placeFr") }}
        </label>
        <input
          id="positionFr-place"
          v-model="placeFr"
          class="position__input position__place"
          placeholder="Paris">
      </span>
      <span class="form-group">
        <label
          class="position__label"
          for="positionFr-time">
          {{ $t("timeFr") }}
        </label>
        <input
          id="positionFr-time"
          v-model="timeFr"
          class="position__input position__time"
          placeholder="le 1er mai 2018">
      </span>
    </span>
    <span class="position__language">
      <p class="positionEn__text">
        {{ $t("lastPositionEn") }}
      </p>
      <span class="form-group">
        <label
          class="position__label"
          for="positionEn-place">
          {{ $t("placeEn") }}
        </label>
        <input
          id="positionEn-place"
          v-model="placeEn"
          class="position__input position__place"
          placeholder="London">
      </span>
      <span class="form-group">
        <label
          class="position__label"
          for="positionEn-time">
          {{ $t("timeEn") }}
        </label>
        <input
          id="positionEn-time"
          v-model="timeEn"
          class="position__input position__time"
          placeholder="29th August 2020">
      </span>
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
        placeFr: null,
        placeEn: null,
        timeFr: null,
        timeEn: null,
      }
    },
    methods: {
      submit(e) {
        e.preventDefault()
        this.updateLastPosition()
      },
      updateLastPosition() {
        if (this.placeFr === null || this.timeFr === null || this.placeEn === null || this.timeEn === null) {
          this.displayErrorMessage()
        } else {
          const position = {
            place: this.placeFr,
            time: this.timeFr,
            placeEn: this.placeEn,
            timeEn: this.timeEn,
          }
          positionsApi.add(position)
            .then(this.updateLastPositionData)
            .then(this.displaySuccessMessage)
        }
      },
      updateLastPositionData() {
        this.$emit('updateLastPositionData', { place: this.placeFr, time: this.timeFr })
        this.resetPosition()
      },
      resetPosition() {
        this.placeFr = null
        this.placeEn = null
        this.timeFr = null
        this.timeEn = null
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
          placeFr: 'Position:',
          placeEn: 'Position:',
          timeFr: 'Date:',
          timeEn: 'Date:',
          lastPositionFr: 'Nouvelle position FR :',
          lastPositionEn: 'New position EN :',
          confirm: 'Envoyer',
          positionUpdated: 'Position mise-à-jour',
          positionNotUpdated: 'Renseigne toutes les informations. La position n\'a pas été mise-à-jour',
        },
        en: {
          placeFr: 'Position FR :',
          placeEn: 'Position EN:',
          timeFr: 'Date FR :',
          timeEn: 'Date EN:',
          lastPositionFr: 'Nouvelle position FR:',
          lastPositionEn: 'New position EN:',
          confirm: 'Confirm',
          positionUpdated: 'Position updated',
          positionNotUpdated: 'Fill all the informations. Position was not updated',
        },
      },
    },
  }
</script>
<style scoped>
  .position__form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }


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

  @media only screen and (min-width: 540px) and (max-width: 992px) {
    .position__form {
      margin-bottom: 60px;
    }
  }
</style>
