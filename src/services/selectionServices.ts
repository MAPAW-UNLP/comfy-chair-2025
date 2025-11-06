import { axiosInstance as api } from './api';

export const executeCutoffSelection = async (sessionId: number, percentage: number) => {
  const response = await api.post(`/api/selection/cut-off/${sessionId}/`, {
    percentage: percentage
  });
  return response.data;
};

export const executeScoreThresholdSelection = async (sessionId: number, cutoffScore: number) => {
  const response = await api.post(`/api/selection/score-threshold/${sessionId}/`, {
    cutoff_score: cutoffScore
  });
  return response.data;
};

export const getSessionById = async (id: number) => {
  const response = await api.get(`/api/session/${id}/`);
  return response.data;
};