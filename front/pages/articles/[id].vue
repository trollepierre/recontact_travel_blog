<template>
  <ArticlePage
    :initial-chapters="chapters"
    :initial-photos="photos"
    :initial-title="title"
    :initial-dropbox-id="idNum"
  />
</template>

<script setup>
import { useRoute, useRuntimeConfig, useAsyncData, useHead } from '#imports'
import { $fetch } from 'ofetch'
import ArticlePage from '@/components/ArticlePage/ArticlePage.vue'
import translationsService from '@/services/services/translations'

definePageMeta({
  validate: (route) => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute()
const idParam = String(route.params.id)
const idNum = Number(idParam)

const config = useRuntimeConfig()
const apiBase = (config.public.apiBase || '').replace(/\/+$/, '')
const lang = (config.public.language || 'fr')

const { data: articleRes } = await useAsyncData(`article-${idParam}`, () =>
  $fetch(`${apiBase}/api/articles/${idParam}`)
)
const { data: photosRes } = await useAsyncData(`photos-${idParam}`, () =>
  $fetch(`${apiBase}/api/photos/${idParam}`)
)

const article = articleRes?.value || {}
const chapters = Array.isArray(article?.chapters) ? article.chapters : []
const photos = Array.isArray(photosRes?.value) ? photosRes.value : []
const title = translationsService?.getTitle
  ? translationsService.getTitle(article, lang)
  : (article?.title || '')

useHead({
  title,
  meta: [
    {
      name: 'description',
      content:
        (Array.isArray(chapters) &&
          chapters[0] &&
          Array.isArray(lang === 'fr' ? chapters[0]?.frText : chapters[0]?.enText) &&
          (lang === 'fr' ? chapters[0].frText[0] : chapters[0].enText[0])) ||
        '',
    },
  ],
})
</script>
