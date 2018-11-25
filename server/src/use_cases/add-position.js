const positionRepository = require('../domain/repositories/position-repository')

function createPosition(position) {
  return positionRepository.create(position)
}

module.exports = {
  addPosition: createPosition,
}
