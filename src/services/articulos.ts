import type { Estado } from '@/components/articulo/ArticuloCard';
import api from './api';
import type { Session } from '@/services/sessions';

export interface Articulo {
  id: number;
  title: string;
  main_file:
  status: Estado;
  type:
  abstract?: string;
  source_file: string;
  authors: [];
  corresponding_author: number;
  session?: Session | null;
}

export const getAllArticulos = async (): Promise<Articulo[]> => {
  const response = await api.get('/api/article');
  return response.data;
};