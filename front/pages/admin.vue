<template>
  <div class="admin-page">
    <app-header/>
    <main>
      <article-list :admin-mode="true"/>
    </main>
  </div>
</template>

<script>
  import ArticleList from '../components/ArticleList/ArticleList.vue'
  import AppHeader from '../components/AppHeader/AppHeader.vue'

  export default {
    name: 'AdminPage',
    components: {
      ArticleList,
      AppHeader,
    },
  }
</script>
