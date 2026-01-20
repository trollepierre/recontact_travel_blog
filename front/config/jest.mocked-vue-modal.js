module.exports = {
  install(app) {
    // minimal $modal mock
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$modal = {
      show: () => {},
      hide: () => {},
    }
  },
}
