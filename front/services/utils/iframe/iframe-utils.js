import { PHONE_LANDSCAPE_TO_TABLET, PHONE_PORTRAIT_TO_LANDSCAPE, screenWidth } from '../screen/screen-utils'

const YOUTUBE_IFRAME_HEIGHT = 315
const YOUTUBE_IFRAME_WIDTH = 560

const DESKTOP_IFRAME_RATIO = 50 / 100
const TABLET_IFRAME_RATIO = 60 / 100
const PHONE_IFRAME_RATIO = 90 / 100

const iframeWidth = () => {
  if (screenWidth() > PHONE_LANDSCAPE_TO_TABLET) {
    return screenWidth() * DESKTOP_IFRAME_RATIO
  }
  if (screenWidth() > PHONE_PORTRAIT_TO_LANDSCAPE) {
    return screenWidth() * TABLET_IFRAME_RATIO
  }
  return screenWidth() * PHONE_IFRAME_RATIO
}

const iframeHeight = () => {
  return iframeWidth() * YOUTUBE_IFRAME_HEIGHT / YOUTUBE_IFRAME_WIDTH
}

const iframeDimensions = () => ({
  width: iframeWidth(),
  height: iframeHeight(),
})

export {
  iframeDimensions,
}
