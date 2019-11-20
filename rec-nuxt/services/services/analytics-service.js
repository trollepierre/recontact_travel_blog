const sendAnalytics = (component, eventCategory, eventAction, eventLabel) => {
  component.$ga.event({
    eventCategory,
    eventAction,
    eventLabel,
  })
}

export default {
  sendAnalytics,
}

