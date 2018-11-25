import { sinon, expect } from '../../test-helper'
import positionRepository from '../../../src/domain/repositories/position-repository'
import { Position } from '../../../src/domain/models/index'

describe('Unit | Repository | position-repository', () => {
  const position = {
    lastPosition: 'Mexico',
    id: 1,
  }

  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Position, 'create')
    })

    afterEach(() => {
      Position.create.restore()
    })

    it('should call Sequelize Model#create', () => {
      // given
      Position.create.resolves(position)
      const positionToCreate = { place: 'Mexico', time: '4 October 1999' }

      // when
      const promise = positionRepository.create(positionToCreate)

      // then
      return promise.then((res) => {
        expect(Position.create).to.have.been.calledWith(positionToCreate)
        expect(res).to.deep.equal(position)
      })
    })
  })

  describe('#getAll', () => {
    const positions = [position]

    beforeEach(() => {
      sinon.stub(Position, 'all').resolves(positions)
    })

    afterEach(() => {
      Position.all.restore()
    })

    it('should call Sequelize Model#all', () => {
      // when
      const promise = positionRepository.getAll()

      // then
      return promise.then((res) => {
        expect(Position.all).to.have.been.calledWith()
        expect(res).to.deep.equal(positions)
      })
    })
  })
})

