import api from './api';

interface Response {
  message: string;
}

export const fetchDummyEndpoint = async (): Promise<Response> => {
  const response = await api.get('/dummy/test/');
  return response.data;
};
