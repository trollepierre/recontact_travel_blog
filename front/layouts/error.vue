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
      if (window.location.pathname.substring(0, 18) === '/apple-touch-icon-') {
        window.location = 'https://www.recontact.me/apple-touch-icon.png'
      }
    },
  }
</script>
