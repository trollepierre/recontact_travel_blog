const { expect, sinon } = require('../test-helper');
const GetLastPosition = require('../../src/use_cases/get-last-position');
const PositionRepository = require('../../src/domain/repositories/position-repository');

describe('Unit | GetLastPosition | getLastPosition', () => {
  const positions = [
    { id: 1, lastPosition: 'Mexico' },
    { id: 2, lastPosition: 'Paris' }
  ];

  beforeEach(() => {
    sinon.stub(PositionRepository, 'getAll').resolves(positions);
  });

  afterEach(() => {
    PositionRepository.getAll.restore();
  });

  it('should call PositionRepository to getAll articles', () => {
    // when
    GetLastPosition.getLastPosition();

    // then
    expect(PositionRepository.getAll).to.have.been.calledWith();
  });

  it('should return only the last position', () => {
    // given
    const lastPosition = { id: 2, lastPosition: 'Paris' };

    // when
    const promise = GetLastPosition.getLastPosition();

    // then
    return promise.then((returnedPositions) => {
      expect(returnedPositions).to.deep.equal(lastPosition);
    });
  });
});

