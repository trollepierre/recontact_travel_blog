<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <nuxt-link to="/">
      Home page
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    props: { error: { type: Object, default: () => {} } },
    mounted() {
      if (this.$route.params.id && this.$route.params.id.substring(0, 17) === '/apple-touch-icon-') {
        this.$router.go('/apple-touch-icon.png')
      }
    },
  }
</script>
