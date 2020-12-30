import { screenWidth } from '../screen/screen-utils'

const PHONE_PORTRAIT_TO_LANDSCAPE = 640
const PHONE_LANDSCAPE_TO_TABLET = 1000

// https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions

const IS_DESKTOP = () => screenWidth() > PHONE_LANDSCAPE_TO_TABLET
const IS_TABLET = () => screenWidth() > PHONE_PORTRAIT_TO_LANDSCAPE && screenWidth() <= PHONE_LANDSCAPE_TO_TABLET
const IS_MOBILE = () => screenWidth() <= PHONE_PORTRAIT_TO_LANDSCAPE

export {
  PHONE_PORTRAIT_TO_LANDSCAPE,
  PHONE_LANDSCAPE_TO_TABLET,
  IS_DESKTOP,
  IS_MOBILE,
  IS_TABLET,
}
