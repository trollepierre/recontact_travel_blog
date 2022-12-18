import CommentRepository from '../src/domain/repositories/comment-repository'
import PositionRepository from '../src/domain/repositories/position-repository'
import SubscriptionRepository from '../src/domain/repositories/subscription-repository'
import ArticleRepository from '../src/domain/repositories/article-repository'
import PhotoRepository from '../src/domain/repositories/photo-repository'
import ChapterRepository from '../src/domain/repositories/chapter-repository'
import fileService from '../src/use_cases/database/file-service'
import { formatDateWithInternationalLongDateTimeFormat } from '../src/domain/utils/date-utils'

const now = formatDateWithInternationalLongDateTimeFormat(new Date())

CommentRepository.getAll()
  .then(comments => {
    const p = JSON.stringify(comments)
    return fileService.write(p, `save/comments/commentsTable-${now}.json`)
  })
PositionRepository.getAll()
  .then(positions => {
    const p = JSON.stringify(positions)
    return fileService.write(p, `save/positions/positionsTable-${now}.json`)
  })

SubscriptionRepository.getAll()
  .then(subscriptions => {
    const p = JSON.stringify(subscriptions)
    return fileService.write(p, `save/subscriptions/subscriptionsTable-${now}.json`)
  })

ArticleRepository.getAll()
  .then(article => {
    const p = JSON.stringify(article)
    return fileService.write(p, `save/articles/articlesTable-${now}.json`)
  })

PhotoRepository.getAll()
  .then(photo => {
    const p = JSON.stringify(photo)
    return fileService.write(p, `save/photos/photosTable-${now}.json`)
  })

ChapterRepository.getAll()
  .then(chapter => {
    const p = JSON.stringify(chapter)
    return fileService.write(p, `save/chapters/chaptersTable-${now}.json`)
  })

