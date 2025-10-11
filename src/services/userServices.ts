import api from './api';

export interface User {
  id: number;
  full_name: string;
  affiliation: string;
  email: string;
  role: string;
  deleted:boolean;
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/user/getUsuarios');
  return response.data;
}