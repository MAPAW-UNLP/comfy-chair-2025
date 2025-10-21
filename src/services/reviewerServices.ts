import api from '@/services/api';

export interface ReviewerInfo {
  id: number;
  full_name?: string;
  // intentamos mapear diferentes nombres que pueda devolver tu serializer
  assigned_count?: number;
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
