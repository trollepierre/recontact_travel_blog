import { createLocalVue, shallowMount, mount, RouterLinkStub } from '@vue/test-utils'

// Export vue-test-utils methods globally
global.RouterLinkStub = RouterLinkStub
global.createLocalVue = createLocalVue
global.shallowMount = shallowMount
global.mount = mount
