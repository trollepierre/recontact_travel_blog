<template>
  <div class="paragraph-card">
    <article class="paragraph">
      <header class="paragraph__header">
        <h2 class="paragraph__title">{{ paragraph.name }}</h2>
      </header>
      <div class="paragraph__content">
        <img src="../assets/webf.jpg" width="200" v-if="paragraph.imgLink==='webf'">
        <img src="../assets/koezio.jpg" width="200" v-if="paragraph.imgLink==='koezio'">
        <!--<img class="paragraph__image" :src="paragraph.imgLink" width="200"/>-->
      </div>
      <footer class="paragraph__footer">
        <p>
          « Il se nommait Santiago. Le jour déclinait lorsqu’il arriva, avec son troupeau, devant une vieille église
          abandonnée. Le toit s’était écroulé depuis bien longtemps, et un énorme sycomore avait grandi à remplacement
          où se trouvait autrefois la sacristie. Il décida de passer la nuit dans cet endroit. Il fit entrer toutes ses
          brebis par la porte en ruine et disposa quelques planches de façon à les empêcher de s’échapper au cours de
          la nuit
        </p>
        <p v-if="paragraph.imgLink==='koezio'">
          Il n’y avait pas de loups dans la région mais, une fois, une bête s’était enfuie, et il avait dû
          perdre toute la journée du lendemain à chercher la brebis égarée. Il étendit sa cape sur le sol et
          s’allongea, en se servant comme oreiller du livre qu’il venait de terminer. Avant de s’endormir, il pensa
          qu’il devrait »
        </p>
        <p>
          Extrait de: Paulo Coelho. « L'alchimiste. » iBooks.
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

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    display: block;
  }

  .paragraph {
    min-width: 260px;
    max-width: 260px;
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
    display: flex;
    justify-content: space-between;
  }

  .paragraph__title {
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    color: #07c;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .paragraph__content {
    font-size: 15px;
    padding: 15px;
    /*height: 150px;*/
    display: block;
    color: #000;
    text-align: center;
  }

  .paragraph__content > img {
    margin-top: 0;
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
