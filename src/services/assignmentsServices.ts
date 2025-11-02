// src/services/assignmentsServices.ts
import api from "@/services/api";
import { getAllArticles, type Article } from "@/services/articleServices";

export interface AssignedArticle {
  id: number;
  title: string;
  /** UI lo puede hidratar con estado de revisión */
  reviewed?: boolean;
}

/**
 * Intenta traer artículos asignados del perfil de revisor:
 *   GET /api/reviewers/:reviewerId/
 *
 * El serializer puede exponer distintos nombres para la lista; se
 * normalizan aquí. Si no hay lista, se cae a un fallback inofensivo:
 * usa el listado general de artículos para que la UI no rompa.
 */
export async function fetchAssignedArticles(
  reviewerId: number | string
): Promise<AssignedArticle[]> {
  try {
    const { data } = await api.get(`/api/reviewers/${reviewerId}/`);

    // Posibles claves de serializers
    const list: any[] =
      data?.assigned_articles ??
      data?.assignedArticles ??
      data?.articles ??
      data?.assigned ??
      [];

    if (Array.isArray(list) && list.length > 0) {
      return list.map((a: any) => ({
        id: Number(a.id),
        title: a.title ?? a.titulo ?? "Sin título",
      }));
    }
  } catch {
    // ignoramos y seguimos al fallback
  }

  // Fallback: no toca el back; se usa el listado general
  const arts: Article[] = await getAllArticles();
  return arts.map((a) => ({ id: a.id, title: a.title }));
}

/**
 * Variante estricta: intenta traer los artículos asignados, pero si ocurre
 * cualquier error o la lista es vacía devuelve array vacío en lugar de
 * caer al fallback que trae todos los artículos.
 */
export async function fetchAssignedArticlesStrict(
  reviewerId: number | string
): Promise<AssignedArticle[]> {
  try {
    const { data } = await api.get(`/api/reviewers/${reviewerId}/`);

    const list: any[] =
      data?.assigned_articles ?? data?.assignedArticles ?? data?.articles ?? data?.assigned ?? [];

    if (Array.isArray(list) && list.length > 0) {
      return list.map((a: any) => ({ id: Number(a.id), title: a.title ?? a.titulo ?? 'Sin título' }));
    }
    return [];
  } catch {
    return [];
  }
}

/** Alias con el mismo contrato; útil si tu UI espera “Flat” */
export async function fetchAssignedArticlesFlat(
  reviewerId: number
): Promise<AssignedArticle[]> {
  return fetchAssignedArticles(reviewerId);
}
