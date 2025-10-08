import { getAllArticulos, type Articulo } from '@/services/articulos';
import { useEffect, useState } from 'react';
import ArticuloCard from '@/components/articulo/ArticuloCard';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articulos')({
  component: RouteComponent,
})

function RouteComponent() {

  const [articulo, setArticulos] = useState<Articulo[]>([]);

  // recupera articulos del server ni bien se abre la app
    useEffect(() => {
      const fetchArticulos = async () => {
        const data = await getAllArticulos();
        const ordenados = [...data].sort((a, b) => b.id - a.id);
        setArticulos(ordenados);
      };
      fetchArticulos();
    }, []);
    
  return (
    /*Comportamiento dinamico del CSS para centrar el mensaje cuando no hay articulos para mostrar, sino rompe las cards*/
    <div className={`flex flex-wrap gap-4 mx-4 justify-center ${articulo.length === 0 ? "min-h-full items-center" : ""}`}>
      {/*Cuando no hay articulos, muestro un mensaje*/}
      {articulo.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold italic text-slate-500 text-center">
            No hay articulos para mostrar...
          </h1>
        </div>
      ) : (
        articulo.map((article) => (
          <ArticuloCard        
            key={article.id}
            titulo={article.title}
            sesion={article.session?.title || 'Sin sesión'}
            conferencia={article.session?.conference?.name || 'Sin conferencia'}
            estado={article.status}
            deadline={article.session?.deadline || 'Sin fecha límite'}
          />
        ))
      )}
    </div>
  );
}
