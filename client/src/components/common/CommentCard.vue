<template>
  <div class="comment-card">
    <article class="comment">
      <div class="comment__content">
        <p>{{ comment.text }}</p>
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    name: 'CommentCard',
    props: {
      comment: { type: Object, default: () => {} },
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

  .comment__content {
    font-size: 15px;
    padding: 15px;
    display: block;
    color: #000;
    text-align: center;
  }

</style>
