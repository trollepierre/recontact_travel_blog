@<template>
  <div id="index">
    <div class="page">
      <app-header/>
      <article-list/>
    </div>
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
