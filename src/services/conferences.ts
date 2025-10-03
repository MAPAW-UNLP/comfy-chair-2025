import api from './api';

export interface Conference {
  id: number
  name: string
}

export const getAllConferences = async (): Promise<Conference[]> => {
  const response = await api.get('/api/conferences');
  return response.data;
}