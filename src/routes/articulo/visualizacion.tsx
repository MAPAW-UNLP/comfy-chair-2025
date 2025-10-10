import {  getAllArticulos } from '@/services/articleServices';
import type {  Articulo } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticuloCard from '@/components/articulo/ArticuloCard';
import { createFileRoute } from '@tanstack/react-router'

//URL de la página
export const Route = createFileRoute('/articulo/visualizacion')({
  component: RouteComponent,
})

function RouteComponent() {

  //Lista de Articulos
  const [articulo, setArticulos] = useState<Articulo[]>([]);

  //Recupera articulos del server ni bien se abre la app
  useEffect(() => {
    const fetchArticulos = async () => {
      const data = await getAllArticulos();
      const ordenados = [...data].sort((a, b) => b.id - a.id);
      setArticulos(ordenados);
    };
    fetchArticulos();
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
          <ArticuloCard
            key={article.id}
            titulo={article.title}
            sesion={article.session?.title ?? 'Sin sesión'}
            conferencia={article.session?.conference?.title ?? 'Sin conferencia'}
            estado={article.status ?? 'Sin estado'}
            deadline={article.session?.deadline ?? 'Sin fecha límite'}
          />
        )))
      )}
    </div>
  );}