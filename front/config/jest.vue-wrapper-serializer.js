const { format, plugins } = require('pretty-format')

const { DOMElement, DOMCollection } = plugins

module.exports = {
  test(val) {
    return (
      val
      && typeof val === 'object'
      && typeof val.html === 'function'
      && val.element
    )
  },
  print(val) {
    return format(val.element, {
      plugins: [DOMElement, DOMCollection],
      printFunctionName: false,
    })
  },
}
