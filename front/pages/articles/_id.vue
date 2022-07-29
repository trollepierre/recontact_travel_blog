<template>
  <article-page/>
</template>

<script>
  import ArticlePage from '../../components/ArticlePage/ArticlePage.vue'

  export default {
    name: 'ArticleIdPage',
    components: {
      ArticlePage,
    },
    validate({ params }) {
      // TODO Doit être un nombre
      return /^\d+$/.test(params.id)
    },
  }
</script>
