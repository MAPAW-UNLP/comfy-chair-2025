// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Servicios relacionados a la app users (alta, baja y modificación).
// También fue modificado por otros grupos para adaptarse a sus necesidades.
//
// -------------------------------------------------------------------------------------- 

import { axiosInstance as api } from './api';
import type { User } from '@/services/userServices';
import type { Session } from '@/services/sessionServices';

export type Type = "regular" | "poster";

export type Status = "reception" | "bidding" | "assignment" | "review" | "selection" | "accepted" | "rejected";

export interface Article {
  id: number;
  title: string;
  main_file: File;
  status: Status;
  type: Type;
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

export interface ArticleUpdate {
  title?: string;
  main_file?: File | null;
  source_file?: File | null;
  status?: string | null;
  type?: string | null;
  abstract?: string;
  authors?: number[];
  corresponding_author?: number | null;
  session?: number | null;
}

function normalizeArticleShape(raw: any): Article {
  return {
    id: Number(raw?.id),
    title: raw?.title ?? raw?.titulo ?? 'Sin título',
    main_file: (raw?.main_file as unknown as File) ?? (null as unknown as File),
    status: (raw?.status as Status) ?? ('reception' as Status),
    type: raw?.type ?? null,
    abstract: raw?.abstract ?? '',
    source_file: (raw?.source_file as unknown as File) ?? null,
    authors: (raw?.authors as User[]) ?? [],
    corresponding_author: (raw?.corresponding_author as User) ?? null,
    session: (raw?.session as Session) ?? null,
  };
}

// GRUPO 1 - Buscar Articulo por ID
export const getArticleById = async (id: number): Promise<Article> => {
  const res = await api.get(`/api/article/${id}/`);
  if (!res.status || res.status >= 400) throw new Error("Error al obtener el artículo");
  return res.data;
};

// GRUPO 1 - Listar Articulos por ID de conferencia - PROVISORIAMENTE SE FILTRAN ACA, DEBE SER UN ENDPOINT
export const getArticlesByConferenceId = async (conferenceId: number): Promise<Article[]> => {
  const response = await api.get('/api/article');
  const articles: Article[] = response.data;
  return articles.filter(article => article.session?.conference?.id === conferenceId);
};

// GRUPO 1 - Alta de Articulos
export async function createArticle(newArticle: ArticleNew) {
  const formData = new FormData();
  formData.append('title', newArticle.title);
  formData.append('main_file', newArticle.main_file);
  if (newArticle.source_file && newArticle.source_file !== null) {
    formData.append('source_file', newArticle.source_file);
  }
  formData.append('status', newArticle.status || 'reception');
  formData.append('type', newArticle.type || '');
  formData.append('abstract', newArticle.abstract || '');
  formData.append('corresponding_author_id', newArticle.corresponding_author?.toString() || '');
  formData.append('session_id', newArticle.session?.toString() || '');

  newArticle.authors.forEach((authorId) => {
    formData.append('authors_ids', authorId.toString());
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
  const data = await response.json();
  return normalizeArticleShape(data);
}
 
// GRUPO 1 - Edición de Articulos
export async function updateArticle(id: number, updated: ArticleUpdate) {
  const formData = new FormData();

  if (updated.title !== undefined) formData.append('title', updated.title as string);
  if (updated.main_file !== undefined && updated.main_file !== null) formData.append('main_file', updated.main_file);
  if (updated.source_file !== undefined) {
  if (updated.source_file === null) {
    formData.append('source_file', '');
    } else {
      formData.append('source_file', updated.source_file);
    }
  }
  if (updated.status !== undefined) formData.append('status', updated.status ?? '');
  if (updated.type !== undefined) formData.append('type', updated.type ?? '');
  if (updated.abstract !== undefined) formData.append('abstract', updated.abstract ?? '');
  if (updated.corresponding_author !== undefined) formData.append('corresponding_author_id', String(updated.corresponding_author ?? ''));
  if (updated.session !== undefined) formData.append('session_id', String(updated.session ?? ''));
  if (updated.authors && Array.isArray(updated.authors)) {
    updated.authors.forEach((a) => formData.append('authors_ids', String(a)));
  }

  try {
    const res = await api.patch(`/api/article/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    throw err;
  }
}

// GRUPO 3 - Obtener artículo por ID de sesión
export const getArticleBySessionId = async (id: number): Promise<Article[]> => {
  console.log('Obteniendo artículos para la sesión con ID:', id);
  const res = await api.get(`/api/article/getArticlesBySessionId/${id}/`);
  if (!res.status || res.status >= 400) throw new Error("Error al obtener los artículos");
  return res.data;
};

// Usado por el grupo 1 en el sprint 1. Se deja por si es usado por otro grupo.
export const getAllArticles = async (): Promise<Article[]> => {
  const response = await api.get('/api/article');
  return response.data;
};