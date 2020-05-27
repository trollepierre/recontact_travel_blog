import axios from 'axios'

const FileReader = {

  async read(filePath) {
    const response = await axios.get(filePath)
    return response.data
  },
}

module.exports = FileReader
