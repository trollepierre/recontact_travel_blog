const { expect, sinon } = require('../test-helper');
const SetPosition = require('../../src/use_cases/set-position');
const PositionRepository = require('../../src/domain/repositories/position-repository');

describe('Unit | SetPosition | setPosition', () => {
  const position = { lastPosition: 'Mexico' };
  const persistedPosition = { id: 1, lastPosition: 'Mexico' };

  beforeEach(() => {
    sinon.stub(PositionRepository, 'create').resolves(persistedPosition);
  });

  afterEach(() => {
    PositionRepository.create.restore();
  });

  it('should call PositionRepository to create articles', () => {
    // when
    SetPosition.setPosition(position);

    // then
    expect(PositionRepository.create).to.have.been.calledWith(position);
  });

  it('should return positions', () => {
    // when
    const promise = SetPosition.setPosition(position);

    // then
    return promise.then((returnedPositions) => {
      expect(returnedPositions).to.deep.equal(persistedPosition);
    });
  });
});

