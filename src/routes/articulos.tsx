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
        setArticulos(data);
      };
      fetchArticulos();
    }, []);

  return (
    <div className="flex flex-wrap gap-4 mx-4 justify-center">
      {articulo.length === 0 ? (
        <div className="flex min-h-svh flex-col items-center justify-center">
          <h1 className="text-3xl font-bold italic text-slate-500 text-center">
            No hay articulos para mostrar...
          </h1>
        </div>
      ) : (
        articulo.map((article) => (
          <ArticuloCard        
            key={article.title}
            titulo={article.title}
            sesion='Sesion de Prueba'
            conferencia={article.session_name}
            estado={article.status}
            deadline={new Date(new Date().getTime() + 121 * 60 * 1000)}
          />
        ))
      )}
    </div>

  );
}
