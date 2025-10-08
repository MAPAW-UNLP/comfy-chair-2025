import api from '@/services/api';

export interface Articulo {
  id: number;
  titulo: string;        // mapeado desde title
  descripcion?: string;  // mapeado desde description
  estado: 'Pendiente' | 'Completo';
}

export async function fetchArticulos(): Promise<Articulo[]> {
  const { data } = await api.get('articles/'); // GET /api/articles/
  return (data ?? []).map((a: any) => ({
    id: a.id,
    titulo: a.title ?? 'Sin título',
    descripcion: a.description ?? '',
    estado: 'Pendiente', // se recalcula en el index según los bids
  }));
}
