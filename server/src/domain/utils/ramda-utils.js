import { either, isEmpty } from 'ramda'

const isFalsy = arg => !arg

const isEmptyPlus = either(
  isFalsy,
  isEmpty,
)

export {
  isEmptyPlus,
}
