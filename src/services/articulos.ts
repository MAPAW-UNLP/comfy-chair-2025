import api from './api';
import type { Revisor } from './revisor';

export interface Article {
  id: number;
  title: string;
  description: string;
  autores?: string[]; // user[];
  revisores?: Revisor[];
}

export const getArticulos = async (): Promise<Article[]> => {
  try {
    const response = await api.get('/articles/articles/');
    const articles = response.data.results;
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    console.error('Error en getArticulos:', error);
    return [];
  }
};

export const getArticuloById = async (id: number): Promise<Article> => {
  const res = await api.get(`/articles/articles/${id}/`)
  if (!res.status || res.status >= 400) throw new Error("Error al obtener el artículo")
  return res.data
}
