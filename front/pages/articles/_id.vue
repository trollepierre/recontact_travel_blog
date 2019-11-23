<template>
  <div id="index">
    <article-page/>
  </div>
</template>

<script>
  import ArticlePage from '../../components/ArticlePage/ArticlePage'

  export default {
    components: {
      ArticlePage,
    },
    validate({ params }) {
      // TODO Doit être un nombre
      return /^\d+$/.test(params.id)
    },
  }
</script>
