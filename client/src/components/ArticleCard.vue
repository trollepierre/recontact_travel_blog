<template>
  <div class="article-card">
    <article class="article">
      <h2 class="article__title">{{ article.name }}</h2>
      <img class="article__image" :src="article.imgLink"/>
    </article>
  </div>
</template>

<script>
  export default {
    name: 'ArticleCard',
    props: ['article'],
  };
</script>

<style scoped>
  h2 {
    font-weight: normal;
  }
</style>
