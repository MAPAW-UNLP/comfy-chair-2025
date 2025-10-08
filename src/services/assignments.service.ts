// src/services/assignments.service.ts
import api from '@/services/api';

export interface AssignedArticle {
  id: number;
  title: string;
  reviewed?: boolean; // true = completado, false/undefined = pendiente
}

export async function fetchAssignedArticles(reviewerId: number): Promise<AssignedArticle[]> {
  // Backend esperado: GET /api/reviewers/{id}/articles/
  // Devuelve: [{ id, title, reviewed }, ...]
  const { data } = await api.get(`reviewers/${reviewerId}/articles/`);
  return (data ?? []).map((a: any) => ({
    id: a.id,
    title: a.title ?? a.titulo ?? 'Sin título',
    reviewed: Boolean(a.reviewed ?? a.revisado ?? a.completado ?? false),
  }));
}
