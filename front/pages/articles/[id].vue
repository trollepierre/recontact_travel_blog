<template>
  <article-page/>
</template>

<script setup>
  import ArticlePage from '../../components/ArticlePage/ArticlePage.vue'

  definePageMeta({
    validate: route => /^\d+$/.test(String(route.params.id)),
  })
</script>

