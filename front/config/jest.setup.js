import { nextTick } from 'vue'
import * as vtu from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'

// Shim createLocalVue for Vue Test Utils v2 API
const createLocalVue = () => {
  const installedPlugins = []
  return {
    use(plugin, ...args) {
      installedPlugins.push([plugin, ...args])
      return this
    },
    _installedPlugins: installedPlugins,
  }
}

const adaptMountOptions = options => {
  if (!options) { return options }
  const {
 localVue, global, router, store, ...rest
} = options
  const baseRouter = createRouter({
    history: createMemoryHistory(),
    routes: [],
  })
  // eslint-disable-next-line global-require
  const { createI18n } = require('vue-i18n')
  const baseI18n = createI18n({
    legacy: true,
    locale: 'en',
    messages: { en: {}, fr: {} },
    fallbackLocale: 'en',
  })

  const collected = localVue && Array.isArray(localVue._installedPlugins)
    ? localVue._installedPlugins
    : []

  const adapted = {
    ...rest,
    global: {
      ...global || {},
      plugins: [
        router || baseRouter,
        store || undefined,
        baseI18n,
        ...global?.plugins || [],
        ...collected,
      ],
      stubs: {
        ...global?.stubs || {},
        RouterLink: vtu.RouterLinkStub,
      },
    },
  }
  // If a plain object router was provided, expose it as $router mock
  if (router && typeof router === 'object' && !router.install) {
    adapted.global.mocks = {
      ...adapted.global.mocks || {},
      $router: router,
    }
  }
  return adapted
}

// Export vue-test-utils methods globally (wrapped to accept legacy options)
global.RouterLinkStub = vtu.RouterLinkStub
global.createLocalVue = createLocalVue
global.shallowMount = (component, options) => vtu.shallowMount(component, adaptMountOptions(options))
global.mount = (component, options) => vtu.mount(component, adaptMountOptions(options))

// Provide Vue.nextTick compatibility for tests written against Vue 2
global.Vue = { nextTick }

// Mute noisy logs in tests (apply before test files import their modules)
const noop = () => {}
// eslint-disable-next-line no-console
console.info = noop
// eslint-disable-next-line no-console
console.warn = noop
// eslint-disable-next-line no-console
console.error = noop

expect.extend({
  toHaveBeenDispatchedToStoreWith(received, argument) {
    expect(received).toHaveBeenCalledTimes(1)
    expect(received).toBeCalledWith(expect.anything(), argument, undefined)
    return { pass: true }
  },
  toHaveBeenCalledOnceWith(received, ...args) {
    expect(received).toHaveBeenCalledTimes(1)
    expect(received).toHaveBeenCalledWith(...args)
    return { pass: true }
  },
  toHaveBeenNotifiedOnceWith(received, ...args) {
    expect(received).toHaveBeenCalledTimes(1)
    expect(received).toHaveBeenCalledWith(expect.anything(), ...args)
    return { pass: true }
  },
  toEmit(received, eventName, data) {
    if (data) {
      expect(received.emitted()[eventName][0]).toEqual([data])
    } else {
      expect(received.emitted()[eventName][0]).toEqual([])
    }
    return { pass: true }
  },
  toBeQueriedWith(received, query, payload, callNumber = 0) {
    expect(received.query.mock.calls[callNumber][0].query).toEqual(query)
    expect(received.query.mock.calls[callNumber][0].variables).toEqual(payload)
    return { pass: true }
  },
  toBeMutatedWith(received, query, payload, callNumber = 0) {
    expect(received.mutate.mock.calls[callNumber][0].mutation).toEqual(query)
    expect(received.mutate.mock.calls[callNumber][0].variables).toEqual(payload)
    return { pass: true }
  },
})
