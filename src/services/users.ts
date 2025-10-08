import api from './api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/api/users');
  return response.data;
}