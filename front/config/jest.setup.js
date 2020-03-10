import { createLocalVue, shallowMount, mount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue' // eslint-disable-line import/no-extraneous-dependencies
import Vuex from 'vuex' // eslint-disable-line import/no-extraneous-dependencies
import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies

// Export vue-test-utils methods globally
global.RouterLinkStub = RouterLinkStub
global.createLocalVue = createLocalVue
global.shallowMount = shallowMount
global.mount = mount
global.Vue = Vue
global.Vuex = Vuex
global.VueRouter = VueRouter

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
