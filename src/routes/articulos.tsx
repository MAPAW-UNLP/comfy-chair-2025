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
        <ul>
          {articulo.map((article) => (
            <ArticuloCard
              titulo={article.title}
              conferencia={article.session_name}
              estado={article.status}
              deadline={new Date(new Date().getTime() + 120 * 60 * 1000)} // 120 minutos desde ahora
            />
          ))}
        </ul>
      </div>
  );
}
