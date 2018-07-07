import { createLocalVue, shallowMount, mount, RouterLinkStub } from '@vue/test-utils'

// Great workaround to remove dumb Vuetify warnings when running tests
// https://github.com/vuetifyjs/vuetify/issues/1210
// https://cdn.24.co.za/files/Cms/General/d/3996/0be99e80265c4ce986fbfcf627a3a82e.gif
const app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.appendChild(app)

// Export vue-test-utils methods globally
global.RouterLinkStub = RouterLinkStub
global.createLocalVue = createLocalVue
global.shallowMount = shallowMount
global.mount = mount
