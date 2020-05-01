<template>
  <div class="comment__form">
    <p class="form__title">
      {{ $t("addComment") }}
    </p>
    <form
      class="form"
      @submit="submitComment">
      <header class="form__header">
        <div class="input-group author">
          <label
            v-if="!isEmpty(newAuthor)"
            class="form__label author"
            for="author">
            {{ $t("name") }}
          </label>
          <input
            id="author"
            v-model="newAuthor"
            :placeholder="anonymous"
            class="forum__comment-box author">
        </div>
      </header>
      <main class="form__content">
        <div class="input-group comment">
          <label
            class="form__label comment"
            for="comment">
            {{ $t("text") }}
          </label>
          <textarea
            id="comment"
            v-model="newComment"
            :placeholder="textPlaceholder"
            class="forum__comment-box text"/>
        </div>
      </main>
      <footer class="form__footer">
        <button
          type="submit"
          class="form-button">
          {{ $t("send") }}
        </button>
      </footer>
    </form>
  </div>
</template>
<script>
  import { isEmpty } from 'ramda'
  import commentsApi from '../../services/api/comments'
  import notificationsService from '../../services/services/notifications'

  export default {
    name: 'CommentForm',
    data() {
      return {
        newComment: '',
        newAuthor: '',
        errorComment: '',
        anonymous: this.$t('name'),
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
            .then(this.resetNewComment)
            .then(this.reloadComments)
            .then(this.displaySuccessNotification)
            .catch(this.displayErrorNotification)
        }
      },
      reloadComments() {
        this.$emit('reload')
      },
      resetNewComment() {
        this.newComment = ''
      },
      displaySuccessNotification() {
        notificationsService.success(this, this.$t('commentSuccess'))
      },
      displayErrorNotification() {
        notificationsService.error(this, this.$t('commentError'))
      },
      isEmpty,
    },
    i18n: {
      messages: {
        fr: {
          addComment: 'Ajouter un commentaire',
          name: 'De la part de',
          commentError: 'Erreur lors de la prise en compte de ton commentaire.',
          commentSuccess: 'Ton commentaire a été pris en compte.',
          anonymous: 'Anonyme',
          textPlaceholder: 'N\'hésitez pas à ajouter des commentaires !',
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

<style scoped>
  .form__title {
    font-size: 1.5em;
    font-weight: bold;
    font-family: serif;
  }

  .form {
    min-width: 260px;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
  }

  .form__header, .form__content {
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .forum__comment-box {
    font-family: serif;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    overflow-wrap: break-word;
    padding-left: 10px;
    border-width: 1px;
    border-style: solid;
    border-color: gray;
    border-image: initial;
  }

  .input-group {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 5px;
    width: 80%;
  }

  .input-group.author {
    width: 60%;
    max-width: 300px;
  }

  .form__label {
    font-size: 16px;
    font-weight: 700;
    font-family: serif;
    color: #07c;
    margin: 0;
    overflow-wrap: break-word;
    padding-bottom: 10px;
  }

  .forum__comment-box.text {
    font-weight: 400;
    height: 100px;
    word-break: keep-all;
    padding: 10px;
  }

  .form__footer {
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }

  .form-button {
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

  .form-button:hover {
    background: #d14800;
    color: #ffffff;
  }

  @media only screen and (max-width: 1000px) {
    .form {
      width: 100%;
    }
  }
</style>
