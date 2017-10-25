const File = require('../../src/domain/external_services/file-reader');
const { expect, sinon } = require('../test-helper');
const request = require('request');
const articleFr = require('../fixtures/articleFr');

// TODO : test when I know where to put that file
describe.skip('Unit | Infrastructure | file', () => {
  describe('#read', () => {
    const filePath = 'https://dl.dropboxusercontent.com/apitl/1/AADgllr4r8';

    beforeEach(() => {
      sinon.stub(request, 'get');
      request.get.callsFake((options, callback) => {
        const httpResponse = {
          body: articleFr,
        };
        callback(null, httpResponse);
      });
    });

    afterEach(() => {
      request.get.restore();
    });

    it('should return response body', () => {
      // when
      const promise = File.read(filePath);

      // then
      return promise.then((chapters) => {
        expect(chapters).to.deep.equal(articleFr);
      });
    });

    it('should call dropbox API "filesListFolder" with emptyPath', () => {
      // when
      File.read(filePath);

      // then
      expect(request.get).to.have.been.calledWith({ url: filePath });
    });
  });
});
