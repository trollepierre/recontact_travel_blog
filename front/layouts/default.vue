<template>
  <div
    id="app"
    :class="classDarkMode">
    <nuxt/>
  </div>
</template>

<script>
  export default {
    name: 'default Layout',
    computed: {
      classDarkMode() {
        if (this.$store.state.theme === 'new') {
          return 'new-mode'
        }
        return this.$store.state.theme === 'dark' ? 'dark-mode' : undefined
      },
    },
  }
</script>

<style lang="scss">
  body {
    padding: 0;
    margin: 0;
  }

  #app {
    font-weight: bold;
    text-align: center;
    background: $bg;
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

