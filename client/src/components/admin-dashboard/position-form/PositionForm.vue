<template>
  <form class="position__form">
    <p class="position__text">
      {{ $t("lastPosition") }}
    </p>
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
    <button
      type="submit"
      class="position__button position__action--send"
      @click.prevent="updateLastPosition">
      {{ $t("confirm") }}
    </button>
  </form>
</template>
<script>
  import articlesApi from '../../../api/articles';
  import positionsApi from '../../../api/positions';

  export default {
    name: 'PositionForm',
    data() {
      return {
        place: null,
        time: null,
      };
    },
    methods: {
      submit(e) {
        console.log('submit')
        e.preventDefault();
        this.updateLastPosition();
      },
      updateLastPosition() {
        console.log('updateLastPosition')
        const position = {
          place: this.place,
          time: this.time,
        };
        positionsApi.add(position)
          .then(this.updateLastPositionData);
      },
      updateLastPositionData() {
        console.log('updateLastPositionData')
        this.$emit('updateLastPositionData', { place, time });
      },

    },

    i18n: {
      messages: {
        fr: {
          place: 'Position :',
          time: 'Date :',
          lastPosition: 'Nouvelle position :',
          confirm: 'Envoyer',
          lastKnownPosition: 'Dernière position connue :',
        },
        en: {
          place: 'Position:',
          time: 'Date:',
          lastPosition: 'New position:',
          confirm: 'Confirm',
          lastKnownPosition: 'Last known position:',
        },
      },
    }
  };
</script>
<style scoped>
  .position__input {
    background: #ffffff;
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
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 230px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .position__button:hover {
    background: #d14800;
    color: #ffffff;
  }

  .position__button:disabled {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }

</style>
