/**
 * Sets up a DOM MutationObserver that watches for elements using undefined CSS
 * class names. Performance should be pretty good, but it's probably best to
 * avoid using this in production.
 *
 * Usage:
 *
 *   import cssCheck from './checkForUndefinedCSSClasses.js'
 *
 *   // Call before DOM renders (e.g. in <HEAD> or prior to React.render())
 *   cssCheck();
 */

const seen = new Set()
let defined

const detectUndefined = node => {
  if (!node?.classList) { return }

  node._cssChecked = true // eslint-disable-line no-param-reassign
  for (const cl of node.classList) { // eslint-disable-line no-restricted-syntax
    // Ignore defined and already-seen classes
    if (defined.has(cl) || seen.has(cl)) { continue } // eslint-disable-line no-continue
    // Mark as seen
    seen.add(cl)

    console.warn(`Undefined CSS class: ${cl}`)
  }
}

const ingestRules = rules => {
  for (const rule of rules) { // eslint-disable-line no-restricted-syntax
    if (rule?.cssRules) { // Rules can contain sub-rules (e.g. @media, @print)
      ingestRules(rule.cssRules)
    } else if (rule.selectorText) {
      // get defined classes
      const classes = rule.selectorText?.match(/\.[\w-]+/g)
      if (classes) {
        for (const cl of classes) { defined.add(cl.substr(1)) } // eslint-disable-line no-restricted-syntax
      }
    }
  }
}

export default function init() { // eslint-disable-line consistent-return
  if (defined) { return defined }
  defined = new Set()

  ingestRules(document.styleSheets)

  // Watch for DOM changes
  const observer = new MutationObserver(mutationsList => {
    for (const mut of mutationsList) { // eslint-disable-line no-restricted-syntax
      if (mut.type === 'childList' && mut?.addedNodes) {
        for (const el of mut.addedNodes) { // eslint-disable-line no-restricted-syntax
          // Ignore text nodes
          if (el.nodeType == 3) { continue } // eslint-disable-line no-continue,eqeqeq
          // Check sub-dom for undefined classes
          detectUndefined(el)
          for (const cel of el.querySelectorAll('*')) { // eslint-disable-line no-restricted-syntax
            detectUndefined(cel)
          }
        }
      } else if (mut?.attributeName == 'class') { // eslint-disable-line eqeqeq
        detectUndefined(mut.target)
      }
    }
  })

  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
  })
}
