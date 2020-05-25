<template>
  <div id="index">
    <article-list :admin-mode="true"/>
  </div>
</template>

<script>
  import ArticleList from '../components/ArticleList/ArticleList.vue'

  export default {
    components: {
      ArticleList,
    },
  }
</script>
