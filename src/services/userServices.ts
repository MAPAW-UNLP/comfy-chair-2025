import { axiosInstance as api } from './api';

export interface User {
  id: number;
  full_name: string;
  affiliation: string;
  email: string;
  role: string;
  deleted:boolean;
}

//------------------------------------------------------------
// GRUPO 1: Trae una lista de usuarios registrados - Usado también por el grupo 3
//------------------------------------------------------------
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/user/getUsers');
  return response.data;
}

// Necesario para grupo 3
export const getCommonUsers= async (): Promise<User[]> =>{
  const response = await api.get('/user/getCommonUsers');
  return response.data;
}

export const getUserById= async (id: number): Promise<User> =>{
  const response = await api.get(`/user/getUserById/${id}`);
  return response.data;
}
