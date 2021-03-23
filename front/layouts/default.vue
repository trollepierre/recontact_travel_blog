<template>
  <div id="app">
    <nuxt/>
  </div>
</template>

<style lang="scss">
  body {
    background: $bg;
    padding: 0;
    margin: 0;
  }

  #app {
    font-weight: bold;
    text-align: center;
    color: $color;
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

