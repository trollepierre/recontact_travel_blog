const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

module.exports = {
  install(app) {
    app.directive('lazy', {
      beforeMount(el, binding) {
        if (binding.arg === 'background-image') {
          // eslint-disable-next-line no-param-reassign
          el.style.backgroundImage = `url(${PLACEHOLDER})`
        } else if (el.tagName === 'IMG') {
          el.setAttribute('src', PLACEHOLDER)
          el.setAttribute('lazy', 'loading')
        }
      },
    })
  },
}
