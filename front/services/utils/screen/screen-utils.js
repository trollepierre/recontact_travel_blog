const screenWidth = () => {
  if (!window) {return '1000'}
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth
}

const screenHeight = () => {
  if (!window) {
    return '600'
  } else {
    return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
  }
}

const PHONE_PORTRAIT_TO_LANDSCAPE = 640
const PHONE_LANDSCAPE_TO_TABLET = 1000

// https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions

export {
  screenWidth,
  screenHeight,
  PHONE_PORTRAIT_TO_LANDSCAPE,
  PHONE_LANDSCAPE_TO_TABLET,
}
