const screenWidth = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth

const screenHeight = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight

const PHONE_PORTRAIT_TO_LANDSCAPE = 640
const PHONE_LANDSCAPE_TO_TABLET = 1000

export {
  screenWidth,
  screenHeight,
  PHONE_PORTRAIT_TO_LANDSCAPE,
  PHONE_LANDSCAPE_TO_TABLET,
}
