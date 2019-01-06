import axios from 'axios'

const CommentsApi = {

  fetch(id) {
    const url = `${process.env.API_URL}api/articles/${id}/comments`
    const options = { headers: { 'Content-Type': 'application/json' } }

    return axios.get(url, options)
      .then(({ data }) => data)
  },

  send(id, comment) {
    const url = `${process.env.API_URL}api/articles/${id}/comments`
    const options = { headers: { 'Content-Type': 'application/json' } }
    return axios.post(url, comment, options)
      .then(({ data }) => data)
  },
}

export default CommentsApi

