import commentsApi from './comments'
import apiService from '../services/api-service'

describe('Unit | API | comments api', () => {
  describe('#fetch', () => {
    let idArticle
    let stubbedResponse

    beforeEach(() => {
      idArticle = 59
      const data = {
        foo: 'bar',
        comments: 'some comments',
      }
      stubbedResponse = {
        status: 200,
        data,
      }
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = `articles/${idArticle}/comments`

      const promise = commentsApi.fetch(idArticle)

      return promise.then(() => {
        expect(apiService.get).toHaveBeenCalledWith(expectedUrl)
      })
    })

    it('should return the response', () => {
      const promise = commentsApi.fetch(idArticle)

      return promise.then(returnedChapters => {
        expect(returnedChapters).toEqual(stubbedResponse)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      apiService.get.mockRejectedValue(new Error('some error'))

      const promise = commentsApi.fetch(accessToken)

      promise.catch(error => {
        expect(error.message).toBe('some error')
        done()
      })
    })
  })

  describe('#send', () => {
    let data
    let stubbedResponse
    const idArticle = 59
    const comment = {
      text: 'Tu es trop fort, Pierre  !',
    }

    beforeEach(() => {
      data = {
        text: 'Tu es trop fort, Pierre  !',
      }
      stubbedResponse = {
        status: 200,
        data,
      }
      apiService.post = jest.fn()
      apiService.post.mockResolvedValue(stubbedResponse)
    })

    it('should send comment to API with the good params', () => {
      const expectedUrl = `articles/${idArticle}/comments`

      const promise = commentsApi.send(idArticle, comment)

      return promise.then(() => {
        expect(apiService.post).toHaveBeenCalledWith(expectedUrl, comment)
      })
    })

    it('should return the response', () => {
      const promise = commentsApi.send(idArticle, comment)

      return promise.then(response => {
        expect(response).toEqual(stubbedResponse)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      apiService.post.mockRejectedValue(new Error('some error'))

      const promise = commentsApi.send(idArticle, comment)

      promise.catch(error => {
        expect(error.message).toBe('some error')
        done()
      })
    })
  })
})
