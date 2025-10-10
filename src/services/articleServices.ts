import api from './api';
import type { Estado } from '@/components/articulo/ArticuloCard';
import type { Session } from '@/services/sessionServices';
import type { User } from '@/services/userServices';

export interface Articulo {
  id: number;
  title: string;
  main_file: File;
  status: Estado;
  type: string | null;
  abstract: string;
  source_file?: File | null;
  authors: User[];
  corresponding_author: User | null;
  session: Session | null;
}

export interface ArticuloNuevo {
  title: string;
  main_file: File;
  status: string | null;
  type: string | null;
  abstract: string;
  source_file?: File | null;
  authors: number[];
  corresponding_author: number | null;
  session: number | null;
}

export const getAllArticulos = async (): Promise<Articulo[]> => {
  const response = await api.get('/api/article');
  return response.data;
};

//Alta de Articulos
export async function createArticle(newArticle: ArticuloNuevo) {
  // Crear FormData
  const formData = new FormData();
  formData.append('title', newArticle.title);
  formData.append('main_file', newArticle.main_file);
  if (newArticle.source_file && newArticle.source_file !== null) {
    formData.append('source_file', newArticle.source_file);
  }
  formData.append('status', newArticle.status || 'reception');
  formData.append('type', newArticle.type || '');
  formData.append('abstract', newArticle.abstract || '');
  formData.append('corresponding_author', newArticle.corresponding_author?.toString() || '');
  formData.append('session', newArticle.session?.toString() || '');

  // Agregar autores
  newArticle.authors.forEach((authorId) => {
    formData.append('authors', authorId.toString());
  });

  const response = await fetch('http://127.0.0.1:8000/api/article/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error response:', errorData);
    console.error('Status:', response.status);
    throw new Error(`Error al crear el artículo: ${JSON.stringify(errorData)}`);
  }
  return response.json();
}