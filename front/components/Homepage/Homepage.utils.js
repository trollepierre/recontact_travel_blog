import { IS_DESKTOP, LARGE_DESKTOP_LIMIT } from '~/services/utils/responsive/responsive-utils'
import { screenWidth } from '~/services/utils/screen/screen-utils'

const LARGE_WIDTH_ARTICLE_CARDS_NUMBER = 4
const SMALL_WIDTH_ARTICLE_CARDS_NUMBER = 3
const MAP_SIZE = 960
const ARTICLE_CARD_SIZE = 300
const NUMBER_OF_ARTICLE_CARDS_ROW = 2

const NUMBER_OF_CARDS_FITTING_IN_WIDTH = () => Math.floor((screenWidth() - MAP_SIZE) / ARTICLE_CARD_SIZE)

export const articlesNumberLimit = () => {
  if (!IS_DESKTOP()) {
    return LARGE_WIDTH_ARTICLE_CARDS_NUMBER
  }
  if (screenWidth() <= LARGE_DESKTOP_LIMIT) {
    return SMALL_WIDTH_ARTICLE_CARDS_NUMBER
  }
  return NUMBER_OF_CARDS_FITTING_IN_WIDTH() * NUMBER_OF_ARTICLE_CARDS_ROW
}

const ARTICLE_CARD_STRICT_SIZE = 270

export const minWidth = () => {
  if (!IS_DESKTOP()) {
    return 0
  }
  if (screenWidth() <= LARGE_DESKTOP_LIMIT) {
    return ARTICLE_CARD_STRICT_SIZE
  }
  return NUMBER_OF_CARDS_FITTING_IN_WIDTH() * ARTICLE_CARD_STRICT_SIZE
}
