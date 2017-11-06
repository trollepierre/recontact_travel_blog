export default {
  toaster(component) {
    return component.$root.$refs.toastr
  },

  success(component, message) {
    this.toaster(component).s(message)
  },

  error(component, message) {
    this.toaster(component).e(message)
  },

  information(component, message) {
    this.toaster(component).i({
      msg: message,
      timeout: 30000,
    })
  },

  removeInformation(component) {
    this.toaster(component).removeByType('info')
  },
}
