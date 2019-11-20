<template>
  <div id="index">
    <article-list :admin-mode="true"/>
  </div>
</template>

<script>
  import ArticleList from '../components/ArticleList/ArticleList';

  export default {
    components: {
      ArticleList,
    },
  }
</script>
