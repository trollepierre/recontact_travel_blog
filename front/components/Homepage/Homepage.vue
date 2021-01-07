<template>
  <div class="homepage">
    <app-header/>
    <main class="lol">
      <h1 class="h1">Retrouvez nos articles à travers le monde :</h1>
      <world-map/>
    </main>
  </div>
</template>

<script>
  import WorldMap from './Map/Map.vue'
  import AppHeader from '../AppHeader/AppHeader.vue'

  export default {
    components: {
      AppHeader,
      WorldMap,
    },
  }

</script>

<style scoped>
.h1 {
  margin-bottom: 30px;
  font-size: 20px;
}

.homepage {
  display: flex;
  justify-content: center;
}
.lol {
  margin-top: 60px;
}

@media only screen and (min-width: 650px) {
  .h1 {
    font-size: 32px;
  }
}
</style>
