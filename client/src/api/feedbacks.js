import axios from 'axios'
import env from '../env/env'

const FeedbacksApi = {

  sendFeedback(feedback, email) {
    const url = `${env('API_URL')}api/feedbacks`
    const body = {
      feedback,
      email,
    }
    const options = { headers: { 'Content-Type': 'application/json' } }

    return axios.post(url, body, options)
  },
}

export default FeedbacksApi
