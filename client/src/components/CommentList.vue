<template>
  <div class="comments-list">
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
          hereTheComments: 'Voici les commentaires de l\'article',
          addComment: 'Ajouter un commentaire',
          commentError: 'Erreur lors de la prise en compte de ton commentaire.',
          commentSuccess: 'Ton commentaire a été pris en compte.',
        },
        en: {
          hereTheComments: 'Here the comments of the article',
          addComment: 'Add a comment',
          commentError: 'Error when adding the comment.',
          commentSuccess: 'Your comment has been taken into consideration.',
        },
      },
    },
  }
</script>
