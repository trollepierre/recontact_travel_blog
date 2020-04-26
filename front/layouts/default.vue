<template>
  <div id="app">
    <app-header/>
    <!--    <subscribe-modal/>-->
    <!--    <feedback-modal/>-->
    <nuxt/>
  </div>
</template>

<script>
  import AppHeader from '../components/AppHeader/AppHeader.vue'
  // import FeedbackModal from '../components/FeedbackModal/FeedbackModal.vue'
  // import SubscribeModal from '../components/SubscribeModal/SubscribeModal.vue'

  export default {
    components: {
      'app-header': AppHeader,
      // 'feedback-modal': FeedbackModal,
      // 'subscribe-modal': SubscribeModal,
    },
  }
</script>

<style>
  body {
    background: aliceblue;
    padding: 0;
    margin: 0;
  }

  #app {
    font-family: "cursive";
    text-align: center;
    color: #2c3e50;
  }

  .v--modal {
    border-radius: 5px;
  }

  @media only screen and (min-width: 640px) {
    .page__container {
      max-width: 600px;
    }
  }

  @media only screen and (min-width: 992px) {
    .page__container {
      max-width: 816px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .page__container {
      max-width: 1088px;
    }
  }
</style>

