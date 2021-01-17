<template>
  <div class="homepage">
    <app-header/>
    <main class="main">
      <h1 class="h1">
        {{  $t("mapHeadline") }}
      </h1>
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
    i18n: {
      silentTranslationWarn: true,
      messages: {
        fr: {
          mapHeadline: 'Retrouvez nos articles à travers le monde :',
        },
        en: {
          mapHeadline: 'Retrieve our articles all around the world:',
        },
      },
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

.main {
  margin-top: 60px;
}

@media only screen and (min-width: 650px) {
  .h1 {
    font-size: 32px;
  }
}
</style>
