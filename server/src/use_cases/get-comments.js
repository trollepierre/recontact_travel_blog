import { maxBy } from 'lodash'

import positionRepository from '../domain/repositories/position-repository'

function getAllPositions() {
  return positionRepository.getAll()
}

async function getComments() {
  return maxBy(await getAllPositions(), 'id')
}

export default {
  getComments,
}
