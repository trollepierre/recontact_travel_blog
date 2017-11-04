import axios from 'axios';

const FeedbacksApi = {

  sendFeedback(feedback, email) {
    const url = `${process.env.API_URL}api/feedbacks`;
    const body = {
      feedback,
      email,
    };
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.post(url, body, options)
      .then(response => Promise.resolve(response.data));
  },
};

export default FeedbacksApi;
