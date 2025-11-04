// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para la visualización de un artículo en detalle
//
// Funcionalidades principales:
//
// - Recuperar el artículo actual (según el parámetro "articleId" de la URL)
// - Mostrar un spinner de carga mientras se recuperan los datos necesarios.
// - Mostrar mensajes informativos si:
//     • El articulo no existe.
// - Permite navegar hacia:
//     • La pantalla de visualizacion de artículos.
// - En caso de éxito, renderiza el componente "ArticleDetail", enviándole como prop
//   el articulo actual.
//
// -------------------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { getArticleById, type Article } from '@/services/articleServices';
import ArticleDetail from '@/components/article/ArticleDetail';

export const Route = createFileRoute('/article/$articleId/detail')({
  component: RouteComponent,
})

function RouteComponent() {

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Parametros de entrada (articleId)
  const { articleId } = useParams({ from: '/article/$articleId/detail' });
  const id = Number(articleId);

  // Articulo actual
  const [article, setArticle] = useState<Article | null>(null);

  // Efecto para traer el articulo actual
  useEffect(() => {

    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch {
        console.error("Error al obtener el artículo");
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

  }, []);

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
      {/* Le envío al componente el articulo actual */}
      <ArticleDetail article={article} /> 
    </div>
  );

}