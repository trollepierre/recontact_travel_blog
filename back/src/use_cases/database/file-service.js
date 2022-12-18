/* eslint-disable no-console */
const fs = require('fs')

function write(object, path) {
  fs.writeFile(path, object, err => {
    if (err) {
      if (err.message.includes('no such file or directory')) {
        console.log('')
        console.log('💡 Please run `$mkdir save` in the /back folder terminal')
        console.log('')
      }
      throw err
    }
    console.log('File saved!')
  })
}

function read(path) {
  return fs.readFile(path, 'utf8', (err, data) => {
    if (err) { throw err }
    return data
  })
}

module.exports = {
  write,
  read,
}
