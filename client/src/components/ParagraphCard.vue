<template>
  <div class="paragraph-card">
    <article class="paragraph">
      <header class="paragraph__header">
        <h2 class="paragraph__title">{{ paragraph.title }}</h2>
      </header>
      <div class="paragraph__content">
        <img src="../assets/webf.jpg" v-if="paragraph.imgLink==='webf'">
        <img src="../assets/koezio.jpg" v-if="paragraph.imgLink==='koezio'">
        <img class="paragraph__image" :src="paragraph.imgLink"/>
      </div>
      <footer class="paragraph__footer">
        <div v-for="text in paragraph.text">
          <p>{{ text }}</p>
        </div>
        <p v-if="paragraph.imgLink==='koezio'">
          Loading...
        </p>
      </footer>
    </article>
  </div>
</template>

<script>
  export default {
    name: 'ParagraphCard',
    props: ['paragraph'],
  };
</script>

<style scoped>
  h2 {
    font-weight: normal;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .paragraph {
    min-width: 260px;
    /*max-width: 260px;*/
    background: #ffffff;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .paragraph__header {
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .paragraph__title {
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    color: #07c;
    margin: 0;
    overflow-wrap: break-word;
  }

  .paragraph__content {
    font-size: 15px;
    padding: 15px;
    display: block;
    color: #000;
    text-align: center;
  }

  .paragraph__footer {
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }

  .paragraph__footer button {
    text-transform: uppercase;
    color: #d14800;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .paragraph__footer button:hover {
    background: #d14800;
    color: #ffffff;
  }

  .paragraph__footer button:disabled,
  .paragraph__footer button:active {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }

</style>
