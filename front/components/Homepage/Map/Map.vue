<template>
  <div id="map"/>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import { articleLocations } from './article-location'
  import translationService from '../../../services/services/translations'

  export default {
    data() {
      return {
        selectedMarker: null,
        map: null,
        markers: [],
        articleLocations,
      }
    },
    mounted() {
      /* istanbul ignore file */

      // https://gist.github.com/mornir/9e85e65caba46e55269302e8a134e04e
      // https://www.mapbox.com/install/js/bundler-complete/
      // https://docs.mapbox.com/mapbox-gl-js/example/

      this.map = new mapboxgl.Map({
        accessToken: process.env.NUXT_ENV_MAPBOX_API_TOKEN,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // default style // V11 - V9 => to try
        center: window.innerWidth > 1024 ? [30, 0] : [30, 30], // mobile center to Lybia
        zoom: window.innerWidth > 650 ? 1 : 0, // 1 = monde, 2 = europe, 3 = west europe, 4 = france,
      })

      this.markers = this.articleLocations.map(articleLocation => {
        const title = translationService.isFrancophone() ? articleLocation.frTitle : articleLocation.enTitle
        const popup = `<a href="${articleLocation.url}" class="font-bold">${title}</a>`
        // if (articleLocation.description) {
        //   popup += `<p>${articleLocation.description}</p>`
        // }
        // popup += `<p>${articleLocation.address}</p>`
        // popup += `<p>${articleLocation.city}</p>`
        // popup += `<br><p>${articleLocation.remark}</p>`

        const LngLat = [articleLocation.location.lng, articleLocation.location.lat]

        const element = document.createElement('div')
        element.className = `marker ${articleLocation.color}`
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
  height: 256px;
  width: 256px;
  margin: auto;
}

.marker {
  background-image: url('Pin.svg');
  background-size: cover;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.blue {
  background-image: url('Pin-blue.svg');
}

.red {
  background-image: url('Pin-red.svg');
}

.green {
  background-image: url('Pin-green.svg');
}

@media only screen and (min-width: 650px) {
  #map {
    height: 400px;
    width: 600px;
  }
}

@media only screen and (min-width: 1024px) {
  #map {
    height: 600px;
    width: 900px;
  }
}
</style>
