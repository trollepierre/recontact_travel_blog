<template>
  <form
    class="forum__form"
    @submit="submitComment">
    <label
      class="forum__label"
      for="comment">
      {{ $t("addComment") }}
    </label>
    <input
      id="comment"
      v-model="newComment"
      class="forum__add-comment"
      placeholder="Mon commentaire. Par Pierre">
  </form>
</template>
<script>
  import commentsApi from '../api/comments'
  import notificationsService from '../services/notifications'

  export default {
    name: 'CommentForm',
    data() {
      return {
        newComment: '',
        errorComment: '',
      }
    },
    methods: {
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
