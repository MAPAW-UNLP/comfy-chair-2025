// src/services/articleServices.ts
import { axiosInstance as api } from './api';

import type { Estado } from '@/components/article/ArticleCard';
import type { Session } from '@/services/sessionServices';
import type { User } from '@/services/userServices';

export interface Article {
  id: number;
  title: string;
  main_file: File;                 // mantenido como en tu base
  status: Estado;
  type: string | null;
  abstract: string;
  source_file?: File | null;
  authors: User[];
  corresponding_author: User | null;
  session: Session | null;
}

export interface ArticleNew {
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

function normalizeArticleShape(raw: any): Article {
  // Hacemos cast directo para no romper tu tipado actual.
  // Si en tu back vienen strings, esto seguirá compilando sin tocar tu UI.
  return {
    id: Number(raw?.id),
    title: raw?.title ?? raw?.titulo ?? 'Sin título',
    main_file: (raw?.main_file as unknown as File) ?? (null as unknown as File),
    status: (raw?.status as Estado) ?? ('reception' as Estado),
    type: raw?.type ?? null,
    abstract: raw?.abstract ?? '',
    source_file: (raw?.source_file as unknown as File) ?? null,
    authors: (raw?.authors as User[]) ?? [],
    corresponding_author: (raw?.corresponding_author as User) ?? null,
    session: (raw?.session as Session) ?? null,
  };
}

/* -------------------------
 * LISTAR
 * ------------------------- */
export const getAllArticles = async (): Promise<Article[]> => {
  const response = await api.get('/api/article');
  return response.data;
};

//Alta de Articulos
export async function createArticle(newArticle: ArticleNew) {
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
  formData.append('session_id', newArticle.session?.toString() || '');

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
  // Normalizamos por consistencia con el resto del servicio
  const data = await response.json();
  return normalizeArticleShape(data);
}

export async function getArticleById(id: number) {
  const { data } = await api.get(`/api/article/${id}/`);
  return data;
}