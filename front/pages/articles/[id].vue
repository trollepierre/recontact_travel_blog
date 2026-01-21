<template>
  <article-page
    :initial-chapters="chapters"
    :initial-photos="photos"
    :initial-title="title"
    :initial-dropbox-id="idNum"
    :initial-comments="comments"/>
</template>

<script setup>
  import { $fetch } from 'ofetch'
  import {
    useRoute, useRuntimeConfig, useAsyncData, useHead,
  } from '#imports'
  import ArticlePage from '@/components/ArticlePage/ArticlePage.vue'
  import translationsService from '@/services/services/translations'

  definePageMeta({
    validate: route => /^\d+$/.test(String(route.params.id)),
  })

  const route = useRoute()
  const idParam = String(route.params.id)
  const idNum = Number(idParam)

  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase || '').replace(/\/+$/, '')
  const lang = config.public.language || 'fr'

  const { data: articleRes } = await useAsyncData(`article-${idParam}`, () => $fetch(`${apiBase}/api/articles/${idParam}`))
  const { data: photosRes } = await useAsyncData(`photos-${idParam}`, () => $fetch(`${apiBase}/api/articles/${idParam}/photos`))
  const { data: commentsRes } = await useAsyncData(`comments-${idParam}`, () => $fetch(`${apiBase}/api/articles/${idParam}/comments`))

  const article = articleRes?.value || {}
  const chapters = Array.isArray(article?.chapters) ? article.chapters : []
  const photos = Array.isArray(photosRes?.value)
    ? photosRes.value.map(p => {
      const link = p && p.imgLink ? String(p.imgLink) : ''
      const isAbsolute = /^https?:\/\//i.test(link)
      return isAbsolute ? p : { ...p, imgLink: `${apiBase}/${link.replace(/^\/+/, '')}` }
    })
    : []
  const comments = Array.isArray(commentsRes?.value) ? commentsRes.value : []
  const title = translationsService?.getTitle
    ? translationsService.getTitle(article, lang)
    : article?.title || ''

  useHead({
    title,
    meta: [
      {
        name: 'description',
        content:
          (Array.isArray(chapters)
            && chapters[0]
            && Array.isArray(lang === 'fr' ? chapters[0]?.frText : chapters[0]?.enText)
            && (lang === 'fr' ? chapters[0].frText[0] : chapters[0].enText[0]))
          || '',
      },
    ],
  })
</script>
