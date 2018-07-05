'use strict';
const path = require('path');

function resolveFromRootDir(dir = '') {
  const ROOT_DIR_RELATIVE_PATH = '..'
  return path.join(__dirname, ROOT_DIR_RELATIVE_PATH, dir);
}

module.exports = {
  resolveFromRootDir,
}
