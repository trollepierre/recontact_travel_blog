import maxBy from 'lodash/maxBy'

import positionRepository from '../domain/repositories/position-repository'

function getAllPositions() {
  return positionRepository.getAll()
}

async function getLastPosition() {
  return maxBy(await getAllPositions(), 'id')
}

export default {
  getLastPosition,
}
