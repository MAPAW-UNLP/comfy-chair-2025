import api from '@/services/api';

export interface ReviewerInfo {
  id: number
  full_name: string
  email?: string
  interest?: 'interesado' | 'quizas' | 'no_interesado' | 'ninguno'
  assigned?: boolean
  assigned_count?: number
}

export async function getReviewerInfo(id: number): Promise<ReviewerInfo> {
  const { data } = await api.get(`reviewers/${id}/`);
  const assigned =
    data?.assigned_count ??
    data?.assignedArticlesCount ??
    data?.articles_assigned ??
    data?.assigned ?? 0;
  return { id: data?.id ?? id, full_name: data?.full_name, assigned_count: Number(assigned) || 0 };
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