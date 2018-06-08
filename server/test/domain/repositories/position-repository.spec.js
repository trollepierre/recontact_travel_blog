const { sinon, expect } = require('../../test-helper');
const positionRepository = require('../../../src/domain/repositories/position-repository');
const { Position } = require('../../../src/domain/models/index');

describe('Unit | Repository | position-repository', () => {
  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Position, 'create');
    });

    afterEach(() => {
      Position.create.restore();
    });

    it('should call Sequelize Model#create', () => {
      // given
      const position = {
        lastPosition: 'Mexico'
      };
      Position.create.resolves(position);

      // when
      const positionToCreate = { email: 'email@mail.com', lang: 'fr' };
      const promise = positionRepository.create(positionToCreate);

      // then

      return promise.then((res) => {
        expect(Position.create).to.have.been.calledWith(positionToCreate);
        expect(res).to.deep.equal(position);
      });
    });
  });

  describe('#getAll', () => {
    beforeEach(() => {
      sinon.stub(Position, 'all').resolves();
    });

    afterEach(() => {
      Position.all.restore();
    });

    it('should call Sequelize Model#all', () => {
      // when
      const promise = positionRepository.getAll();

      // then
      return promise.then(() => {
        expect(Position.all).to.have.been.called;
      });
    });
  });
});

