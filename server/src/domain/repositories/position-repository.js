const { Position } = require('../models/index');

function getAll() {
  return Position.all();
}

module.exports = {
  getAll,
};
