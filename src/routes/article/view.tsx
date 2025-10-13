import { getAllArticles } from '@/services/articleServices';
import type { Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import { createFileRoute } from '@tanstack/react-router'

//URL de la página
export const Route = createFileRoute('/article/view')({
  component: RouteComponent,
})

function RouteComponent() {

  //Lista de Articulos
  const [articulo, setArticulos] = useState<Article[]>([]);

  //Recupera articulos del server ni bien se abre la app
  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getAllArticles();
      const ordenados = [...data].sort((a, b) => b.id - a.id);
      setArticulos(ordenados);
    };
    fetchArticles();
  }, []);
    
  //Cuerpo del Componente
  return (
    <div className={`flex flex-wrap gap-4 mx-4 justify-center ${articulo.length === 0 ? "min-h-full items-center" : ""}`}>
      {articulo.length === 0 ? (
        /*Si no hay articulos, muestro un mensaje*/
        (<div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold italic text-slate-500 text-center">
            No hay artículos para mostrar...
          </h1>
        </div>)
      ) : (
        /*Si hay articulos, mapeo cada uno en un componente ArticuloCard*/
        (articulo.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            session={article.session?.title ?? 'Sin sesión'}
            conference={article.session?.conference?.title ?? 'Sin conferencia'}
            state={article.status ?? 'Sin estado'}
            deadline={article.session?.deadline ?? 'Sin fecha límite'}
          />
        )))
      )}
    </div>
  );}