import { useState } from 'react';
import type { Articulo } from '@/services/articulos';
import { ArticuloCard } from './ArticuloCard';

import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ListaArticulosProps {
  items: Articulo[];
}

export const ListaArticulos = ({ items }: ListaArticulosProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  const totalPaginas = Math.ceil(items.length / itemsPorPagina);

  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const indiceFinal = indiceInicial + itemsPorPagina;
  const articulosVisibles = items.slice(indiceInicial, indiceFinal);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const irAPagina = (num: number) => {
    setPaginaActual(num);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Listado de Artículos</h1>

      <ul className="space-y-4">
        {articulosVisibles.map((articulo) => (
          <ArticuloCard key={articulo.id} articulo={articulo} />
        ))}
      </ul>

      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {articulosVisibles.length} de {items.length} artículos
      </div>


      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                paginaAnterior();
              }}
              className={
                paginaActual === 1 ? 'opacity-50 pointer-events-none' : ''
              }
            />
          </PaginationItem>


          {Array.from({ length: totalPaginas }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={paginaActual === i + 1}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  irAPagina(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                siguientePagina();
              }}
              className={
                paginaActual === totalPaginas
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
