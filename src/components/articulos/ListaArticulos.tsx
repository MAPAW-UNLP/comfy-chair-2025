import { useState, useEffect } from 'react';
import type { Articulo } from '@/services/articulos';
import { ArticuloCard } from './ArticuloCard';

import {
  Pagination,
  PaginationContent,
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
  const [filtro, setFiltro] = useState<'Todos' | 'Completos' | 'Incompletos'>(
    'Todos'
  );
  const itemsPorPagina = 3;

  // Determina si un articulo está completo
  const estaCompleto = (articulo: Articulo) => {
    return articulo.revisores && articulo.revisores.length === 3;
  };

  // Filtra según selección
  const articulosFiltrados = items.filter((articulo) => {
    if (filtro === 'Todos') return true;
    if (filtro === 'Completos') return estaCompleto(articulo);
    if (filtro === 'Incompletos') return !estaCompleto(articulo);
    return true;
  });

  // Resetea a página 1 cuando cambia el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  // Calcula paginación con los artículos fitlrados
  const totalPaginas = Math.ceil(articulosFiltrados.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const indiceFinal = indiceInicial + itemsPorPagina;
  const articulosVisibles = articulosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

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
      <h1 className="text-2xl font-bold mb-4">Lista de Artículos</h1>

      <div className="flex gap-2 mb-6">
        {(['Todos', 'Completos', 'Incompletos'] as const).map((opcion) => (
          <button
            key={opcion}
            onClick={() => setFiltro(opcion)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filtro === opcion
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opcion}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-gray-200">
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
