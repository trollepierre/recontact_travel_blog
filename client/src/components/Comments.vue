<template>
  <div class="comments">
    <comment-form
      :new-comment="newComment"
      :submit-comment="submitComment"/>
    <comment-list :comments="comments"/>
  </div>
</template>
<script>
  import CommentForm from './CommentForm.vue'
  import CommentList from './CommentList.vue'
  import notificationsService from '../services/notifications'
  import commentsApi from '../api/comments'

  export default {
    name: 'Comments',
    components: { CommentForm, CommentList },
    data() {
      return {
        comments: [],
        newComment: '',
        errorComment: '',
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
      submitComment(e) {
        e.preventDefault()
        if (this.newComment !== '') {
          return commentsApi.send(this.dropboxId, this.newComment)
            .then(this.displaySuccessNotification)
            .catch(() => {
              this.displayErrorNotification()
            })
        }
      },
      displaySuccessNotification() {
        notificationsService.success(this, this.$t('commentSuccess'))
      },
      displayErrorNotification() {
        notificationsService.error(this, this.$t('commentError'))
      },
    },
    i18n: {
      messages: {
        fr: {
          addComment: 'Ajouter un commentaire',
          commentError: 'Erreur lors de la prise en compte de ton commentaire.',
          commentSuccess: 'Ton commentaire a été pris en compte.',
        },
        en: {
          addComment: 'Add a comment',
          commentError: 'Error when adding the comment.',
          commentSuccess: 'Your comment has been taken into consideration.',
        },
      },
    },
  }
</script>
