<template>
  <form
    class="forum__form"
    @submit="submitComment">
    <p class="form-title">{{ $t("addComment") }}</p>
    <div class="input-group author">
      <label
        class="forum__label"
        for="author">
        {{ $t("name") }}
      </label>
      <input
        id="author"
        v-model="newAuthor"
        class="forum__comment-box author"
        :placeholder="anonymous">
    </div>
    <div class="input-group comment">
      <label
        class="forum__label"
        for="comment">
        {{ $t("text") }}
      </label>
      <input
        id="comment"
        v-model="newComment"
        class="forum__comment-box text"
        :placeholder="textPlaceholder">
    </div>
    <button
      type="submit"
      class="form-button">
      {{ $t("send") }}
    </button>
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
        newAuthor: '',
        errorComment: '',
        anonymous: this.$t('anonymous'),
        textPlaceholder: this.$t('textPlaceholder'),
        dropboxId: parseInt(this.$route.params.id, 10),
      }
    },
    methods: {
      submitComment(e) {
        e.preventDefault()
        if (this.newComment !== '') {
          const comment = {
            text: this.newComment,
            author: this.newAuthor,
          }
          return commentsApi.send(this.dropboxId, comment)
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
          name: 'De la part de',
          commentError: 'Erreur lors de la prise en compte de ton commentaire.',
          commentSuccess: 'Ton commentaire a été pris en compte.',
          anonymous: 'Anonyme',
          textPlaceholder: 'N\'hésitez pas à ajouter des commentaires !',
          send: 'Envoyer',
          text: 'Votre message',
        },
        en: {
          addComment: 'Add a comment',
          name: 'From',
          commentError: 'Error when adding the comment.',
          commentSuccess: 'Your comment has been taken into consideration.',
          anonymous: 'Anonymous',
          textPlaceholder: 'Add your comment here!',
          send: 'Send',
          text: 'Your message',
        },
      },
    },
  }
</script>

<style>
  .forum__form {
    margin: 20px;
  }

  .form-title {
    font-size: 1.5em;
    font-weight: bold;
  }

  .input-group {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .forum__label {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .forum__comment-box {
    font-size: 1.5em;
    align-items: start;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    padding-left: 10px;
  }

  .forum__comment-box.text {
    height: 100px;
  }

  button.form-button {
    text-transform: uppercase;
    color: #d14800;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
    max-width: 300px;
  }
</style>
