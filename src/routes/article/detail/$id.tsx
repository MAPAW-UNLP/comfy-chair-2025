import { createFileRoute, useParams } from '@tanstack/react-router'
import { getArticleById, type Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleDetail from '@/components/article/ArticleDetail';

export const Route = createFileRoute('/article/detail/$id')({
  component: RouteComponent,
})

function RouteComponent() {

  const { id } = useParams({ from: '/article/detail/$id' });
  const articleId = Number(id);
  const [article, setArticle] = useState<Article | undefined>(undefined);

  // Fetch del artículo actual
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(articleId);
        setArticle(data);
      } catch (error) {
        console.error("Error al obtener el artículo:", error);
      }
    };
    fetchArticle();
  }, [articleId]);
  
  //Cuerpo del Componente
  return (
      <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
        {/*Importo el Form y le envío los usuarios y conferencias de la app*/}
        <ArticleDetail article={article} /> 
      </div>
    )
}
