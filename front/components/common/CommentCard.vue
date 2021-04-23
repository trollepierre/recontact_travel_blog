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
        const language = this.$store.state.locale
        if (translationService.isFrancophone(language)) {
          return `De ${this.comment.author} - ${date}`
        }
        return `From ${this.comment.author} - ${date}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .comment {
    min-width: 260px;
    background: $comment-card-bg;
    border-radius: 4px;
    border: 1px solid $border;
    display: flex;
    flex-direction: column;
    color: $comment-card-color;
  }

  .comment__header {
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
    color: $comment-card-label;
    margin: 0;
    overflow-wrap: break-word;
  }

  .comment__footer {
    text-align: center;
    padding: 15px;
    border-top: 1px solid $border;
  }
</style>
