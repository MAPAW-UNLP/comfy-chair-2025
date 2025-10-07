import api from './api';

export interface Revisor {
  id: number;
  nombre_completo: string;
  email: string;
  interes: 'interesado' | 'quizas' | 'no_interesado' | 'ninguno';
  asignado?: boolean;
}

export const getRevisoresByArticulo = async (
  articuloId: number
): Promise<Revisor[]> => {
  const response = await api.get(`/chairs/articulos/${articuloId}/revisores-disponibles/`);
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
