<template xmlns:v-lazy="http://www.w3.org/1999/xhtml">
  <div class="photo-card">
    <article class="photo">
      <div class="photo__content">
        <div ref="container">
          <img v-lazy="imgLink"/>
          <div v-lazy:background-image="imgLink"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    name: 'PhotoCard',
    props: ['photo'],
    mounted() {
      this.$Lazyload.lazyLoadHandler();
    },
    computed: {
      imgLink() {
        const { imgLink } = this.photo;
        if (!imgLink) {
          return false;
        }
        return imgLink;
      },
    },
  };
</script>

<style scoped>
  img {
    max-width: 100%;
    max-height: 100%;
  }

  .photo {
    min-width: 260px;
    background: #ffffff;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .photo__content {
    font-size: 15px;
    padding: 15px;
    display: block;
    color: #000;
    text-align: center;
  }

</style>
