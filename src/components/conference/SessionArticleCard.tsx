import React from 'react'
import type { Article } from "../../services/articleServices";

type SessionArticleCardProps= {
    article: Article;
}

function SessionArticleCard({article}: SessionArticleCardProps) {
  return (
    <div className='flex flex-col shadow'>
      <h2>{article.title}</h2>
    </div>
  )
}

export default SessionArticleCard
