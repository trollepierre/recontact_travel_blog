const request = require('request');
const articleFr = require('../../test/unit/fixtures/articleFr');

const FileSystem = {

  read(filePath) {
    return new Promise((resolve, reject) => {
      const options = {
        url: filePath,
      };

      request.get(options, (err, response) => {
        if (err) {
          reject(err);
        }
        // const projects = JSON.parse(response);
        console.log('response');
        console.log(response);

        // TODO fix that
        // resolve(articleFr);
        // console.log('resolve called');

        resolve(response.body);
      });
    });
  },
};

module.exports = FileSystem;
