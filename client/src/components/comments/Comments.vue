<template>
  <div class="comments">
    <comment-list/>
    <comment-form/>
  </div>
</template>
<script>
  import CommentForm from './CommentForm.vue'
  import CommentList from './CommentList.vue'

  export default {
    name: 'Comments',
    components: { CommentForm, CommentList },
  }
</script>
