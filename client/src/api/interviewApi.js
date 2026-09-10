import apiClient from './apiClient';

export const interviewApi = {
  createInterview: (payload) => apiClient.post('/interviews', payload),
  getInterviews: () => apiClient.get('/interviews'),
  getInterviewById: (id) => apiClient.get(`/interviews/${id}`),
  joinInterview: (roomCode) => apiClient.post('/interviews/join', { roomCode }),
};

export default interviewApi;
