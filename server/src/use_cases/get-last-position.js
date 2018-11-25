const { maxBy } = require('lodash')

const positionRepository = require('../domain/repositories/position-repository')

function getAllPositions() {
  return positionRepository.getAll()
}

async function getLastPosition() {
  return maxBy(await getAllPositions(), 'id')
}

module.exports = {
  getLastPosition,
}
