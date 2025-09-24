import api from './api';

export interface Revisor {
  id: number;
  nombre_completo: string;
  email: string;
  interes: 'interesado' | 'quizas' | 'no_interesado' | 'ninguno';
}

export const getRevisoresByArticulo = async (
  articuloId: number
): Promise<Revisor[]> => {
  const response = await api.get(`/chairs/articulos/${articuloId}/revisores-disponibles/`);
  return response.data;
};
