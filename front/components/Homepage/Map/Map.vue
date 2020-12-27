<template>
  <div id="map"/>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import { articleLocation } from '@/components/Homepage/Map/article-location'
  import translationService from '../../../services/services/translations'

  export default {
    data() {
      return {
        selectedMarker: null,
        map: null,
        markers: [],
        articleLocation,
      }
    },
    mounted() {
      /* istanbul ignore file */

      // https://gist.github.com/mornir/9e85e65caba46e55269302e8a134e04e
      // https://www.mapbox.com/install/js/bundler-complete/
      // https://docs.mapbox.com/mapbox-gl-js/example/

      const parisLocation = [2.213749, 46.227638]
      const southernLocation = [-25, 40] // used to display Martinique on the mobile view

      this.map = new mapboxgl.Map({
        accessToken: process.env.NUXT_ENV_MAPBOX_API_TOKEN,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // default style // V11 - V9 => to try
        // center: window.innerWidth <= 1024 ? southernLocation : parisLocation,
        center: southernLocation,
        zoom: 1, // 1 = monde, 2 = europe, 3 = west europe, 4 = france,
      })

      this.markers = this.articleLocation.map(articleLocation => {
        const title = translationService.isFrancophone() ? articleLocation.frTitle : articleLocation.enTitle
        const popup = `<a href="${articleLocation.url}" class="font-bold">${title}</a>`
        // if (articleLocation.description) {
        //   popup += `<p>${articleLocation.description}</p>`
        // }
        // popup += `<p>${articleLocation.address}</p>`
        // popup += `<p>${articleLocation.city}</p>`
        // popup += `<br><p>${articleLocation.remark}</p>`

        const element = document.createElement('div')
        element.className = 'marker'
        element.addEventListener('click', e => {
          // flyTo sometimes fails to trigger the close event on the popup
          if (this.selectedMarker) {
            this.selectedMarker.classList.remove('hidden')
          }
          this.selectedMarker = e.target
          this.selectedMarker.classList.add('hidden')
          this.map.flyTo({ center: LngLat, speed: 0.5 })
        })
        const popupElement = new mapboxgl.Popup({
          offset: 0,
          anchor: 'bottom',
        }).setHTML(popup)
        popupElement.on('close', () => {
          if (this.selectedMarker) {
            this.selectedMarker.classList.remove('hidden')
          }
        })

        const LngLat = [articleLocation.location.lng, articleLocation.location.lat]
        const marker = new mapboxgl.Marker({ element, offset: [0, -10] })
          .setLngLat(LngLat)
          .setPopup(popupElement)
          .addTo(this.map)

        marker.description = title
        return marker
      })
    },
  }
</script>
<style>
#map {
  background-color: blue;
}

.mapboxgl-canvas {
  background-color: pink;
}
.mapboxgl-canvas-container {
  background-color: green;
}

#map,
.mapboxgl-canvas,
.mapboxgl-canvas-container {
  height: 400px;
  width: 600px;
}

.marker {
  background-image: url('Pin.svg');
  background-size: cover;
  width: 50px;
  height: 50px;
  cursor: pointer;
}

@media only screen and (min-width: 650px) {
  #map,
  .mapboxgl-canvas {
  }
}

@media only screen and (min-width: 1024px) {
  #map,
  .mapboxgl-canvas {
  }
}
</style>
