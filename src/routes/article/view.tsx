import { getAllArticles } from '@/services/articleServices';
import type { Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

//URL de la página
export const Route = createFileRoute('/article/view')({
  component: RouteComponent,
})

function RouteComponent() {

   const navigate = useNavigate();

   const handleClick = () => navigate({to: '/article/create', replace: true });

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
    <div className="mx-4 my-4 flex flex-col items-center gap-4">
      <Button variant="outline" className="bg-slate-900 text-white" onClick={handleClick}>
        Subir Artículo +
      </Button>
      {articulo.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
          <h1 className="text-2xl font-bold italic text-slate-500 text-center">
            No hay artículos para mostrar...
          </h1>
        </div>
      ) : (
        <div className="flex flex-wrap w-3/4 gap-4 justify-center">
          {articulo.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );}