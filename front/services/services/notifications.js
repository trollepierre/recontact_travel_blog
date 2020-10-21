export default {
  information(message) {
    console.log(message)
  },

  error(message) {
    console.error(message)
    window.alert(message) // eslint-disable-line no-alert
  },

  warn(message) {
    console.warn(message)
  },
}
