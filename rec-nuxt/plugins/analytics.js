import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import env from '../services/env/env'

// TODO adapt to router
Vue.use(VueAnalytics, {
  id: `${env('ANALYTICS_KEY')}`,
  autoTracking: {
    exception: true,
  },
})

