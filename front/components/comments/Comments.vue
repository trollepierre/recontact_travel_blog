<template>
  <section>
    <comment-list
      :to-reload="toReload"
      :initial-comments="initialComments"
      @reloaded="reloadOff"/>
    <comment-form @reload="reloadTo"/>
  </section>
</template>
<script>
  import CommentForm from './CommentForm.vue'
  import CommentList from './CommentList.vue'

  export default {
    name: 'CommentsContainer',
    components: { CommentForm, CommentList },
    props: {
      initialComments: { type: Array, default: () => [] },
    },
    data() {
      return {
        toReload: false,
      }
    },
    methods: {
      reloadTo() {
        this.toReload = true
      },
      reloadOff() {
        this.toReload = false
      },
    },
  }
</script>
