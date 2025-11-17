// src/services/reviewedArticlesService.ts
import api from "./api"

export interface ReviewedArticle {
  id: number
  title: string
  abstract: string
  author_full_name: string
  total_reviews: number
  avg_score: number | null
}

export async function getReviewedArticles(): Promise<ReviewedArticle[]> {
  const { data } = await api.get("/api/chair/articles-reviewed/")
  return data
}
