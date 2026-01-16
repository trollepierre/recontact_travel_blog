<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <a href="/">
      Home page
    </a>
  </div>
</template>

<script>
  export default {
    name: 'ErrorLayout',
    props: { error: { type: Object, default: () => {} } },
  }
</script>
