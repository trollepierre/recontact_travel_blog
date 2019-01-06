import positionRepository from '../domain/repositories/position-repository'

function createPosition(position) {
  return positionRepository.create(position)
}

export default {
  addComment: createPosition,
}
