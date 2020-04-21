import { expect } from '../../test-helper'
import { enhanceComment } from '../../../src/domain/entities/comment-entity'
import { commentFromDb } from '../../fixtures/comments/commentFromDb'
import { commentForFront } from '../../fixtures/comments/commentForFront'

describe('Unit | Entity | comment-entity', () => {
  describe('#enhanceComment', () => {
    it('should prepare comment from db for front', () => {
      // when
      const comment = enhanceComment(commentFromDb())

      // then
      expect(comment).to.deep.equal(commentForFront())
    })
  })
})

