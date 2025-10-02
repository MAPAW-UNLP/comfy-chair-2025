import { axiosInstance as api } from './api';

interface TestResponse {
  message: string;
}

export const fetchDummyEndpoint = async (): Promise<TestResponse> => {
  const response = await api.get('/dummy/test/');
  return response.data;
};

export interface Dummy {
  id: number;
  name: string;
  created_at: string;
}

export const createDummy = async (name: string): Promise<Dummy> => {
  const response = await api.post('/dummy/new/', { name });
  return response.data;
};

export const getAllDummies = async (): Promise<Dummy[]> => {
  const response = await api.get('/dummy/');
  return response.data;
};
