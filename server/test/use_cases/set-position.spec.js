const { expect, sinon } = require('../test-helper')
const AddPosition = require('../../src/use_cases/add-position')
const PositionRepository = require('../../src/domain/repositories/position-repository')

describe('Unit | AddPosition | addPosition', () => {
  const position = { lastPosition: 'Mexico' }
  const persistedPosition = { id: 1, lastPosition: 'Mexico' }

  beforeEach(() => {
    sinon.stub(PositionRepository, 'create').resolves(persistedPosition)
  })

  afterEach(() => {
    PositionRepository.create.restore()
  })

  it('should call PositionRepository to create position', () => {
    // when
    AddPosition.addPosition(position)

    // then
    expect(PositionRepository.create).to.have.been.calledWith(position)
  })

  it('should return added position', () => {
    // when
    const promise = AddPosition.addPosition(position)

    // then
    return promise.then((returnedPositions) => {
      expect(returnedPositions).to.deep.equal(persistedPosition)
    })
  })
})

