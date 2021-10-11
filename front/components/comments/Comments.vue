<template>
  <section>
    <comment-list
      :to-reload="toReload"
      @reloaded="reloadOff"/>
    <comment-form @reload="reloadTo"/>
  </section>
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
      reloadOff() {
        this.toReload = false
      },
    },
  }
</script>
