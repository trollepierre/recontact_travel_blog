const screenWidth = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth

const height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight

const PHONE_PORTRAIT_TO_LANDSCAPE = 600
const PHONE_LANDSCAPE_TO_TABLET = 1000

export {
  screenWidth,
  height,
  PHONE_PORTRAIT_TO_LANDSCAPE,
  PHONE_LANDSCAPE_TO_TABLET,
}
