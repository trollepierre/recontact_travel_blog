import { expect, sinon } from '../../test-helper'
import commentRepository from '../../../src/domain/repositories/comment-repository'
import { Comment } from '../../../src/domain/models/index'
import { commentFromDb } from '../../fixtures/comments/commentFromDb'
import { commentForFront } from '../../fixtures/comments/commentForFront'

describe('Unit | Repository | comment-repository', () => {
  const expectedComment = commentForFront()
  const comment = commentFromDb()

  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Comment, 'create')
      sinon.stub(Comment, 'findOne')
    })

    afterEach(() => {
      Comment.create.restore()
      Comment.findOne.restore()
    })

    it('should call Sequelize Model#create', () => {
      // given
      Comment.create.resolves('comment whatever')
      Comment.findOne.resolves(comment)
      const commentToCreate = { dropboxId: '85', author: 'Mexico', text: '4 October 1999' }

      // when
      const promise = commentRepository.create(commentToCreate)

      // then
      return promise.then(res => {
        expect(Comment.create).to.have.been.calledWith(commentToCreate)
        expect(res).to.deep.equal(expectedComment)
      })
    })
  })

  describe('#getAllById', () => {
    beforeEach(() => {
      sinon.stub(Comment, 'findAll').resolves([comment])
    })

    afterEach(() => {
      Comment.findAll.restore()
    })

    it('should call Sequelize Model#findAll', () => {
      // when
      const promise = commentRepository.getAllById()

      // then
      return promise.then(res => {
        expect(Comment.findAll).to.have.been.calledWith()
        expect(res).to.deep.equal([expectedComment])
      })
    })
  })
})

