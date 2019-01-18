import { expect, sinon } from '../../test-helper'
import commentRepository from '../../../src/domain/repositories/comment-repository'
import { Comment } from '../../../src/domain/models/index'

describe.skip('Unit | Repository | comment-repository', () => {
  const comment = {
    lastComment: 'Mexico',
    id: 1,
  }

  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Comment, 'create')
    })

    afterEach(() => {
      Comment.create.restore()
    })

    it('should call Sequelize Model#create', () => {
      // given
      Comment.create.resolves(comment)
      const commentToCreate = { place: 'Mexico', time: '4 October 1999' }

      // when
      const promise = commentRepository.create(commentToCreate)

      // then
      return promise.then(res => {
        expect(Comment.create).to.have.been.calledWith(commentToCreate)
        expect(res).to.deep.equal(comment)
      })
    })
  })

  describe('#getAll', () => {
    const comments = [comment]

    beforeEach(() => {
      sinon.stub(Comment, 'all').resolves(comments)
    })

    afterEach(() => {
      Comment.all.restore()
    })

    it('should call Sequelize Model#all', () => {
      // when
      const promise = commentRepository.getAll()

      // then
      return promise.then(res => {
        expect(Comment.all).to.have.been.calledWith()
        expect(res).to.deep.equal(comments)
      })
    })
  })
})

