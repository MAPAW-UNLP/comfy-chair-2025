// src/services/reviewsForArticleService.ts
import api from "./api"

export interface ArticleReview {
  review_id: number
  score: number
  opinion: string
  reviewer: {
    id: number
    full_name: string
    email: string
  }
}

export async function getReviewsForArticle(articleId: number): Promise<ArticleReview[]> {
  const { data } = await api.get(`/api/chair/articles/${articleId}/reviews/`)
  return data
}
