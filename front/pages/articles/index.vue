<template>
  <div class="articles-page">
    <app-header/>
    <main>
      <article-list/>
    </main>
  </div>
</template>

<script>
  import ArticleList from '../../components/ArticleList/ArticleList.vue'
  import AppHeader from '../../components/AppHeader/AppHeader.vue'

  export default {
    components: {
      ArticleList,
      AppHeader,
    },
  }
</script>
