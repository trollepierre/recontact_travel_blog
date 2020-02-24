<template>
  <div class="comment-card">
    <article class="comment">
      <header class="comment__header">
        <p class="comment__author">
          {{ commentAuthor }}
        </p>
      </header>
      <footer class="comment__footer">
        <p>{{ comment.text }}</p>
      </footer>
    </article>
  </div>
</template>

<script>
  import translationService from '../../services/services/translations'

  export default {
    name: 'CommentCard',
    props: { comment: { type: Object, default: () => {} } },
    computed: {
      commentAuthor() {
        const date = this.comment.createdAt
        if (translationService.isFrancophone()) {
          return `De ${this.comment.author} - ${date}`
        }
        return `From ${this.comment.author} - ${date}`
      },
    },
  }
</script>

<style scoped>
  .comment {
    min-width: 260px;
    background: #ffffff;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .comment__header {
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .comment__author {
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    color: #07c;
    margin: 0;
    overflow-wrap: break-word;
  }

  .comment__footer {
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }
</style>
