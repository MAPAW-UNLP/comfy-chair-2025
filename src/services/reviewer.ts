import api from './api';

export interface Reviewer {
  id: number;
  full_name: string;
  email: string;
  interest: 'interesado' | 'quizas' | 'no_interesado' | 'ninguno';
  assigned?: boolean;
}

export const getReviewersByArticle = async (
  articuloId: number
): Promise<Reviewer[]> => {
  const response = await api.get(`chairs/articles/${articuloId}/available-reviewers/`);
  return response.data;
};

export const assignReviewerToArticle = async (reviewerId: number, articleId: number) => {
  const response = await api.post('/chairs/new/', {
    reviewer: reviewerId,
    article: articleId,
    reviewed: false,
  });
  return response.data;
};

export const removeReviewerFromArticle = async (reviewerId: number, articleId: number) => {
  const response = await api.delete(`/chairs/reviews/${reviewerId}/${articleId}/delete/`);
  return response.data;
};
