import { createFileRoute, useParams } from '@tanstack/react-router'
import { getArticleById, type Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleDetail from '@/components/article/ArticleDetail';

export const Route = createFileRoute('/article/detail/$id')({
  component: RouteComponent,
})

function RouteComponent() {

  // Parametros de entrada
  const { id } = useParams({ from: '/article/detail/$id' });
  const articleId = Number(id);

  // Articulo actual
  const [article, setArticle] = useState<Article | null>(null);

  // Estado de carga
  const [loading, setLoading] = useState(true);
  
  // Efecto para traer el articulo actual
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(articleId);
        setArticle(data ?? null);
      } catch (error) {
        console.error("Error al obtener el artículo:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  // Spinner de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-full">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mensaje si el articulo no existe
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center">
          No se encontró el artículo solicitado...
        </h1>
      </div>
    );
  }
  
  // Cuerpo del componente
  return (
    <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
      <ArticleDetail article={article} /> 
    </div>
  );

}