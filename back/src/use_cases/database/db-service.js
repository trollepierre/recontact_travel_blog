import CommentRepository from '../../domain/repositories/comment-repository'
import PositionRepository from '../../domain/repositories/position-repository'
import SubscriptionRepository from '../../domain/repositories/subscription-repository'
import ArticleRepository from '../../domain/repositories/article-repository'
import PhotoRepository from '../../domain/repositories/photo-repository'
import ChapterRepository from '../../domain/repositories/chapter-repository'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

const { isEmpty } = require('ramda')

const fs = require('fs')

const files = fs.readdirSync('save/comments')

function initComments() {
  const path = `save/comments/${files[files.length - 1]}`

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) { throw err }
    const comments = await CommentRepository.getAll()
    if (isEmpty(comments)) {
      return Promise.all(JSON.parse(data).map(comment => CommentRepository.create(comment)))
        .then(() => CommentRepository.getAll())
    }
    // eslint-disable-next-line no-console
    return console.error('error there is data in comments table')
  })
}

const filesPositions = fs.readdirSync('save/positions')

function initPositions() {
  const path = `save/positions/${filesPositions[filesPositions.length - 1]}`

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) { throw err }
    const positions = await PositionRepository.getAll()
    if (isEmpty(positions)) {
      return Promise.all(JSON.parse(data).map(task => PositionRepository.create(task)))
        .then(() => PositionRepository.getAll())
    }
    // eslint-disable-next-line no-console
    return console.error('error there is data in positions table')
  })
}

const filesSubscriptions = fs.readdirSync('save/subscriptions')

function initSubscriptions() {
  const path = `save/subscriptions/${filesSubscriptions[filesSubscriptions.length - 1]}`

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) { throw err }
    const subscriptions = await SubscriptionRepository.getAll()
    if (isEmpty(subscriptions)) {
      return Promise.all(JSON.parse(data).map(subscription => SubscriptionRepository.create(subscription)))
        .then(() => SubscriptionRepository.getAll())
    }
    // eslint-disable-next-line no-console
    return console.error('error there is data in subscriptions table')
  })
}
const filesChapters = fs.readdirSync('save/chapters')

function initChapters() {
  const path = `save/chapters/${filesChapters[filesChapters.length - 1]}`

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) { throw err }
    const chapters = await ChapterRepository.getAll()
    console.log('chapters.length')
    console.log(chapters.length)
    if (isEmpty(chapters)) {
      return ChapterRepository.createArticleChapters(JSON.parse(data))
    }
    // eslint-disable-next-line no-console
    return console.error('error there is data in chapters table')
  })
}
const filesArticles = fs.readdirSync('save/articles')

function initArticles() {
  const path = `save/articles/${filesArticles[filesArticles.length - 1]}`

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) { throw err }
    const articles = await ArticleRepository.getAll()
    if (isEmpty(articles)) {
      return Promise.all(JSON.parse(data).map(article => ArticleRepository.add(article)))
        .then(() => ArticleRepository.getAll())
    }
    // eslint-disable-next-line no-console
    return console.error('error there is data in articles table')
  })
}
const filesPhotos = fs.readdirSync('save/photos')

function initPhotos() {
  const path = `save/photos/${filesPhotos[filesPhotos.length - 1]}`

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) { throw err }
    const photos = await PhotoRepository.getAll()
    console.log('photos.length')
    console.log(photos.length)
    if (isEmpty(photos)) {
      return PhotoRepository.createPhotos(JSON.parse(data))
    }
    // eslint-disable-next-line no-console
    return console.error('error there is data in photos table')
  })
}

const init = () => {
  /* eslint-disable no-console */
  console.log('init started')

  initComments()
  console.log('init Comments done')
  initPositions()
  console.log('init Positions done')
  initSubscriptions()
  console.log('init Subscriptions done')
  initArticles()
  console.log('init Articles done')
  initChapters()
  console.log('init Chapters done')
  initPhotos()
  console.log('init Photos done')
  /* eslint-enable no-console */
}

module.exports = {
  init,
}
