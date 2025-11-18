"use client"

import { useEffect, useState } from "react"
import {
  getReviewsForArticle,
  type ArticleReview,
} from "@/services/reviewsForArticleServices"

export const ArticleReviewsDetail = ({ articleId }: { articleId: number }) => {
  const [reviews, setReviews] = useState<ArticleReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReviewsForArticle(articleId)
        setReviews(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [articleId])

  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-semibold">
        Cargando revisiones...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Revisiones del artículo
      </h1>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">
          Este artículo aún no tiene revisiones publicadas.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.review_id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <div className="flex justify-between mb-2">
                <strong>{rev.reviewer.full_name}</strong>
                <span className="font-bold">{rev.score}/3</span>
              </div>

              <p className="text-sm text-gray-800 italic">{rev.reviewer.email}</p>
              <p className="mt-3">{rev.opinion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
