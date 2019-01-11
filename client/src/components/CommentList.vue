<template>
  <div
    v-if="!isEmptyPlus(comments)"
    class="comments-list">
    <h2 class="forum__name">
      {{ $t("hereTheComments") }}
    </h2>
    <ul class="forum__comment-list">
      <li
        v-for="comment in comments"
        :key="comment.text"
        class="comment__item">
        <comment-card :comment="comment"/>
      </li>
    </ul>
  </div>
</template>
<script>
  import CommentCard from './common/CommentCard.vue'
  import commentsApi from '../api/comments'
  import { isEmptyPlus } from '../../../server/src/domain/utils/ramda-utils'

  export default {
    name: 'CommentList',
    components: { CommentCard },
    data() {
      return {
        comments: [],
      }
    },
    mounted() {
      this.fetchComments()
    },
    methods: {
      isEmptyPlus,
      fetchComments() {
        commentsApi.fetch(this.dropboxId)
          .then(comments => {
            this.comments = comments
          })
      },
    },
    i18n: {
      messages: {
        fr: {
          hereTheComments: 'Voici les commentaires de l\'article !',
        },
        en: {
          hereTheComments: 'Here the comments of the article!',
        },
      },
    },
  }
</script>
