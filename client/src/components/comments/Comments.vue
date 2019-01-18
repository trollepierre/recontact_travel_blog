<template>
  <div class="comments">
    <comment-list :to-reload="toReload"/>
    <comment-form @reload="reloadTo"/>
  </div>
</template>
<script>
  import CommentForm from './CommentForm.vue'
  import CommentList from './CommentList.vue'

  export default {
    name: 'Comments',
    components: { CommentForm, CommentList },
    data() {
      return {
        toReload: false,
      }
    },
    methods: {
      reloadTo() {
        this.toReload = true
      },
    },
  }
</script>
