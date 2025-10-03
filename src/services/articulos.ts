import type { Estado } from '@/components/articulo/ArticuloCard';
import api from './api';

export interface Conference {
  id: number
  name: string
}

export interface Session {
  id: number
  title: string
  deadline: string
  conference?: Conference | null
}

export interface Articulo {
  id: number
  title: string
  status: Estado
  article_type: string
  session?: Session | null
}

export const getAllArticulos = async (): Promise<Articulo[]> => {
  const response = await api.get('/api/articles');
  return response.data;
}