import api from './api';
import type { Reviewer } from './reviewer';

export interface Article {
  id: number;
  title: string;
  description: string;
  autores?: string[]; // user[];
  reviewers?: Reviewer[];
}

export const getArticulos = async (): Promise<Article[]> => {
  try {
    const response = await api.get('/api/article/'); // corregido
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error en getArticulos:', error);
    return [];
  }
};

export const getArticleById = async (id: number): Promise<Article> => {
  const res = await api.get(`/api/article/${id}/`); // corregido
  if (!res.status || res.status >= 400) throw new Error("Error al obtener el artículo");
  return res.data;
};

