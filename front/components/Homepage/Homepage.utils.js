import { IS_DESKTOP, LARGE_DESKTOP_LIMIT } from '~/services/utils/responsive/responsive-utils';
import { screenWidth } from '~/services/utils/screen/screen-utils';

const LARGE_WIDTH_ARTICLE_CARDS_NUMBER = 4
const SMALL_WIDTH_ARTICLE_CARDS_NUMBER = 3
const MAP_SIZE = 960
const ARTICLE_CARD_SIZE = 300
const NUMBER_OF_ARTICLE_CARDS_ROW = 2

export const articlesNumberLimit = () => {
  if (!IS_DESKTOP()) {
    return LARGE_WIDTH_ARTICLE_CARDS_NUMBER
  }
  if (screenWidth() <= LARGE_DESKTOP_LIMIT) {
    return SMALL_WIDTH_ARTICLE_CARDS_NUMBER
  }
  return Math.floor((screenWidth() - MAP_SIZE) / ARTICLE_CARD_SIZE) * NUMBER_OF_ARTICLE_CARDS_ROW
}
