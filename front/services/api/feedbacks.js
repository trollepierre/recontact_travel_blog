import apiService from '../services/api-service'

const FeedbacksApi = {

  sendFeedback(feedback, email) {
    const url = 'feedbacks'
    const body = {
      feedback,
      email,
    }
    return apiService.post(url, body)
  },
}

export default FeedbacksApi
