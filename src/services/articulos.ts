import type { Estado } from '@/components/articulo/ArticuloCard';
import api from './api';

export interface Articulo {
  title: string;
  session_name: string;
  status: Estado;
  deadline: Date;
}

export const getAllArticulos = async (): Promise<Articulo[]> => {
  const response = await api.get('/api/articles');
  return response.data;
}