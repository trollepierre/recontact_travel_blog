<template xmlns:v-lazy="http://www.w3.org/1999/xhtml">
  <article class="photo">
    <div
      ref="container"
      class="photo__content">
      <img
        v-lazy="imgLink"
        class="img"
        rel="noreferrer"
        :alt="image">
      <div v-lazy:background-image="imgLink"/>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'PhotoCard',
    props: {
      photo: {
        type: Object,
        default: () => {
        },
      },
    },
    computed: {
      imgLink() {
        const { imgLink } = this.photo
        return !imgLink ? false : imgLink
      },
      image() {
        return this.$t('alt')
      },
    },
    mounted() {
      this.$Lazyload.lazyLoadHandler()
    },
    i18n: {
      messages: {
        fr: {
          alt: 'Une image',
        },
        en: {
          alt: 'An image',
        },
      },
    },
  }
</script>

<style  lang="scss" scoped>
  .img {
    max-width: 100%;
    max-height: 40vw;
  }

  @media only screen and (max-width: 640px) {
    .img {
      max-height: 100%;
    }
  }

  .photo {
    min-width: 260px;
    background: $card-bg;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px $border;
    border: 1px solid $border;
    display: flex;
    flex-direction: column;
  }

  .photo__content {
    font-size: 15px;
    padding: 15px;
    display: block;
    color: $card-placeholder;
    text-align: center;
  }

</style>
