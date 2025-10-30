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

function isFilledReview(r: Partial<Review> | null | undefined) {
  return !!(r && typeof r.score === 'number' && String(r.opinion ?? '').trim());
}

// Trae la review propia del revisor para un artículo (puede no existir → 404)
export async function getOwnReviewByArticle(articleId: number): Promise<Review | null> {
  try {
    const { data } = await api.get(`/api/review/${articleId}/`, {
      // permitimos 404 sin lanzar excepción
      validateStatus: s => s === 200 || s === 404,
    });
    return (data as Review) ?? null;
  } catch {
    return null;
  }
}

export async function hasOwnReview(articleId: number): Promise<boolean> {
  const r = await getOwnReviewByArticle(articleId);
  return isFilledReview(r);
}

export async function createReview(payload: {
  article: number;
  reviewer: number;
  opinion: string;
  score: number;
}) {
  const { data } = await api.post(`/api/reviews/`, payload);
  return data as Review;
}

export async function updateReview(id: number, payload: { opinion?: string; score?: number }) {
  const { data } = await api.put(`/api/reviews/${id}/update/`, payload);
  return data as Review;
}

export async function publishReview(id: number) {
  const { data } = await api.put(`/api/reviews/${id}/publish/`);
  return data as Review;
}

// ✅ Unifica criterio “Completada”: al menos 1 review publicada del artículo
export async function hasPublishedReview(articleId: number): Promise<boolean> {
  try {
    const { data } = await api.get(`/api/article/${articleId}/reviews/`, {
      validateStatus: () => true, // ese endpoint responde 200 siempre con {count}
    });
    return Number(data?.count ?? 0) > 0;
  } catch {
    return false;
  }
}
