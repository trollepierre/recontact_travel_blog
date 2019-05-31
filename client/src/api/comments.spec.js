import axios from 'axios'
import commentsApi from './comments'
import env from '../env/env'

xdescribe('Unit | API | comments api', () => {
  describe('#fetch', () => {
    let idArticle
    let data

    beforeEach(() => {
      idArticle = 59
      data = {
        foo: 'bar',
        comments: 'some comments',
      }
      const stubbedResponse = {
        status: 200,
        data,
      }
      axios.get = jest.fn()
      axios.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/articles/${idArticle}/comments`
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } }

      const promise = commentsApi.fetch(idArticle)

      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions)
      })
    })

    it('should return the response', () => {
      const promise = commentsApi.fetch(idArticle)

      return promise.then(returnedChapters => {
        expect(returnedChapters).toEqual(data)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      axios.get.mockRejectedValue(new Error('some error'))

      const promise = commentsApi.fetch(accessToken)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })

  describe('#send', () => {
    let data
    const idArticle = 59
    const comment = {
      text: 'Tu es trop fort, Pierre  !',
    }

    beforeEach(() => {
      data = {
        text: 'Tu es trop fort, Pierre  !',
      }
      const stubbedResponse = {
        status: 200,
        data,
      }
      axios.post = jest.fn()
      axios.post.mockResolvedValue(stubbedResponse)
    })

    it('should send comment to API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/articles/${idArticle}/comments`
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } }

      const promise = commentsApi.send(idArticle, comment)

      return promise.then(() => {
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, comment, expectedOptions)
      })
    })

    it('should return the response', () => {
      const promise = commentsApi.send(idArticle, comment)

      return promise.then(response => {
        expect(response).toEqual(data)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      axios.post.mockRejectedValue(new Error('some error'))

      const promise = commentsApi.send(idArticle, comment)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })
})
