
import api from './api';

export interface Conference {
  id: number
  title: string
  description: string
  start_date: Date 
  end_date : Date
  blind_kind : boolean
}

export const getAllConferences = async (): Promise<Conference[]> => {
  const response = await api.get('/api/conference');
  return response.data;
}