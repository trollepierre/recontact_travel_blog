const { maxBy } = require('lodash');

const positionRepository = require('../domain/repositories/position-repository');

function getAllPositions() {
  return positionRepository.getAll();
}

function getLastPosition() {
  return maxBy(getAllPositions(), 'id');
}

module.exports = {
  getLastPosition,
};
