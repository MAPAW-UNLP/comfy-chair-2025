// src/services/reviewerServices.ts
import api from '@/services/api';

export interface Review {
  id: number;
  article: number;
  reviewer: number;
  opinion: string;
  score: number;
  is_published?: boolean;
  is_edited?: boolean;
}

export interface ReviewerInfo {
  id: number
  full_name: string
  email?: string
  interest?: 'interesado' | 'quizas' | 'no_interesado' | 'ninguno'
  assigned?: boolean
  assigned_count?: number
}

export type CreateReviewPayload = {
  article: number;
  reviewer: number;
  opinion: string;
  score: number;
};

export type UpdateReviewPayload = {
  opinion?: string;
  score?: number;
};

function isFilledReview(r: Partial<Review> | null | undefined) {
  return !!(r && typeof r.score === 'number' && String(r.opinion ?? '').trim());
}

/**
 * Trae la review propia del revisor para un artículo.
 * Backend: GET /api/reviews/{articleId}/{reviewerId}/
 *  - 200 → objeto Review
 *  - 404 → no existe (null)
 *  - 401/otros → null (se loguea error para depurar)
 */
export async function getOwnReviewByArticle(
  articleId: number,
  reviewerId: number
): Promise<Review | null> {
  try {
    const res = await api.get(`/api/reviews/${articleId}/${reviewerId}/`, {
      validateStatus: () => true, // manejamos manualmente
    });
    if (res.status === 200) return res.data as Review;
    if (res.status === 404) return null;
    console.error('getOwnReviewByArticle unexpected status', res.status, { articleId, reviewerId });
    return null;
  } catch (e) {
    console.error('getOwnReviewByArticle error', e);
    return null;
  }
}

/**
 * ¿El revisor ya dejó una review (aunque no esté publicada)?
 */
export async function hasOwnReview(articleId: number, reviewerId: number): Promise<boolean> {
  const r = await getOwnReviewByArticle(articleId, reviewerId);
  return isFilledReview(r);
}

/**
 * Crea una review (del revisor actual para un artículo)
 * Backend: POST /api/reviews/
 */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const { data } = await api.post(`/api/reviews/`, payload);
  return data as Review;
}

/**
 * Actualiza una review existente
 * Backend: PUT /api/reviews/{id}/update/
 */
export async function updateReview(id: number, payload: UpdateReviewPayload): Promise<Review> {
  const { data } = await api.put(`/api/reviews/${id}/update/`, payload);
  return data as Review;
}

/**
 * Publica una review
 * Backend: PUT /api/reviews/{id}/publish/
 */
export async function publishReview(id: number): Promise<Review> {
  const { data } = await api.put(`/api/reviews/${id}/publish/`);
  return data as Review;
}

/**
 * ✅ Criterio unificado “Completada”:
 * Al menos 1 review publicada del artículo
 * Backend: GET /api/article/{articleId}/reviews/ → { count: number }
 */
export async function hasPublishedReview(articleId: number): Promise<boolean> {
  try {
    const { data } = await api.get(`/api/article/${articleId}/reviews/`, {
      validateStatus: () => true,
    });
    return Number(data?.count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * (Opcional) Cantidad de reviews publicadas del artículo
 */
export async function getPublishedReviewsCount(articleId: number): Promise<number> {
  try {
    const { data } = await api.get(`/api/article/${articleId}/reviews/`, {
      validateStatus: () => true,
    });
    return Number(data?.count ?? 0);
  } catch {
    return 0;
  }
}

export const getReviewersByArticle = async (
  articuloId: number
): Promise<ReviewerInfo[]> => {
  const response = await api.get(`/api/chair/articles/${articuloId}/available-reviewers/`);
  return response.data;
};

export const assignReviewerToArticle = async (reviewerId: number, articleId: number) => {
  const response = await api.post('/api/chair/new/', {
    reviewer: reviewerId,
    article: articleId,
    reviewed: false,
  })
  return response.data
}

export const removeReviewerFromArticle = async (reviewerId: number, articleId: number) => {
  const response = await api.delete(`/api/chair/${reviewerId}/${articleId}/delete/`)
  return response.data
}

/**
 * Obtener todas las reviews de un artículo
 * Backend: GET /api/reviews/{articleId}/
 */
export const getReviewsByArticle = async (articleId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`/api/reviews/${articleId}/`, {
      validateStatus: () => true,
    });
    if (response.status === 200 && response.data) {
      // El backend devuelve un objeto individual, lo envolvemos en array 
      return [response.data as Review];
    }
    return [];
  } catch (e) {
    console.error('getReviewsByArticle error', e);
    return [];
  }
};
