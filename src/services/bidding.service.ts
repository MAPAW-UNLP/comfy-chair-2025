// src/services/bidding.service.ts
import api from '@/services/api';

export type Interes = 'Interesado' | 'Quizás' | 'No Interesado';

export interface BiddingPreference {
  id: number;
  reviewer: number;
  article: number;
  choice: Interes | '';
}

const norm = (x: any): Interes | '' => {
  const v = (x ?? '').toString().toLowerCase();
  if (v.includes('quiz')) return 'Quizás';
  if (v.includes('no')) return 'No Interesado';
  if (v.includes('interes')) return 'Interesado';
  return '';
};

// --- utils ---
function dedupeByArticle(rows: any[]): BiddingPreference[] {
  // conserva el registro con mayor id por artículo
  const byArticle = new Map<number, any>();
  for (const r of rows ?? []) {
    const prev = byArticle.get(r.article);
    if (!prev || r.id > prev.id) byArticle.set(r.article, r);
  }
  return [...byArticle.values()].map((b: any) => ({ ...b, choice: norm(b.choice) }));
}

// --- reads ---
export async function getBidsByReviewer(reviewerId: number): Promise<BiddingPreference[]> {
  const { data } = await api.get('bids/', { params: { reviewerId } }); // ← barra final
  return dedupeByArticle(data ?? []);
}

// --- writes (primitivos) ---
export async function upsertBid(p: { reviewer: number; article: number; value: Interes }) {
  const payload = { reviewer: p.reviewer, article: p.article, choice: p.value };
  const { data } = await api.post('bidding/', payload); // ← barra final
  return { ...data, choice: norm(data.choice) } as BiddingPreference;
}

export async function updateBid(id: number, value: Interes) {
  const { data } = await api.put(`bidding/${id}/`, { choice: value }); // ← barra final
  return { ...data, choice: norm(data.choice) } as BiddingPreference;
}

/**
 * Guardado seguro (PUT si existe / POST si no), evitando duplicados.
 * Devuelve el bid vigente (normalizado) para ese artículo.
 */
export async function saveBid(params: {
  reviewer: number;
  article: number;
  value: Interes;
}): Promise<BiddingPreference> {
  // 1) Traer bids del revisor ya deduplicados
  const current = await getBidsByReviewer(params.reviewer);
  const existing = current.find((b) => b.article === params.article);

  // 2) PUT si existe, POST si no
  if (existing) {
    return updateBid(existing.id, params.value);
  }
  return upsertBid(params);
}
