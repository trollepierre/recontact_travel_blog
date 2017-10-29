const request = require('request');

const FileReader = {

  read(filePath) {
    return new Promise((resolve, reject) => {
      const options = {
        url: filePath,
      };

      request.get(options, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response.body);
      });
    });
  },
};

module.exports = FileReader;
