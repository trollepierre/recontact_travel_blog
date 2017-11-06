<template>
  <div id="app">
    <app-header/>
    <subscribe-modal/>
    <feedback-modal/>
    <router-view/>
  </div>
</template>

<script>
  import AppHeader from '@/components/AppHeader';
  import FeedbackModal from '@/components/FeedbackModal';
  import SubscribeModal from '@/components/SubscribeModal';

  export default {
    name: 'App',

    components: {
      'app-header': AppHeader,
      'feedback-modal': FeedbackModal,
      'subscribe-modal': SubscribeModal,
    },
  };
</script>

<style>
  body {
    background: aliceblue;
    padding: 0;
    margin: 0;
  }

  #app {
    font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .v--modal {
    border-radius: 5px;
  }

  @media only screen and (min-width: 640px) {
    .page__container {
      max-width: 544px;
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
