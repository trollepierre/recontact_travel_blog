<template>
  <div
    v-if="!isEmpty(comments)">
    <h2>
      {{ $t("hereTheComments") }}
    </h2>
    <ul class="forum__comment-list">
      <li
        v-for="comment in comments"
        :key="comment.createdAt"
        class="comment__item">
        <comment-card :comment="comment"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import { isEmptyPlus as isEmpty } from '../../services'
  import CommentCard from '../common/CommentCard.vue'
  import commentsApi from '../../services/api/comments'

  export default {
    name: 'CommentList',
    components: { CommentCard },
    props: {
      toReload: { type: Boolean, default: () => false },
    },
    data() {
      return {
        comments: [],
        dropboxId: parseInt(this.$route.params.id, 10),
      }
    },
    watch: {
      async toReload() {
        await commentsApi.fetch(this.dropboxId)
          .then(comments => {
            this.comments = comments
          })
          .then(this.reloaded)
      },
    },
    mounted() {
      commentsApi.fetch(this.dropboxId)
        .then(comments => {
          this.comments = comments
        })
    },
    methods: {
      isEmpty,
      reloaded() {
        this.$emit('reloaded')
      },
    },
    i18n: {
      messages: {
        fr: {
          hereTheComments: 'Voici les commentaires de l\'article  !',
        },
        en: {
          hereTheComments: 'Here the comments of the article!',
        },
      },
    },
  }
</script>

<style scoped>
  .forum__comment-list {
    padding: 0;
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  .comment__item {
    display: block;
    margin-bottom: 20px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (max-width: 1000px) {
    .comment__item {
      width: 100%;
    }
  }
</style>
