<template>
  <div class="homepage">
    <app-header/>
    <main class="lol">
      map
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
.homepage {
  display: flex;
  justify-content: center;
}
.lol {
  margin-top: 100px;
}
</style>
