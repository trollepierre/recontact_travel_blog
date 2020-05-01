import { either, isEmpty } from 'ramda'

const isFalsy = arg => !arg

const isEmptyPlus = either(
  isFalsy,
  isEmpty,
)

const sortByAscendingNumber = (list, key) => list.sort((objectA, objectB) => {
  if (objectA[key] > objectB[key]) {
    return 1
  }
  if (objectA[key] < objectB[key]) {
    return -1
  }
  return 0
})

export {
  isEmptyPlus,
  sortByAscendingNumber,
}
