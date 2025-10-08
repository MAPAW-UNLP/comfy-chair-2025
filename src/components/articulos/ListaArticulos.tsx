import { useState, useEffect } from 'react';
import type { Articulo } from '@/services/articulos';
import { ArticuloCard } from './ArticuloCard';
import { Button } from '@/components/ui/button';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    <div className="min-h-screen bg-ring">
      <div className="bg-gray-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lista de Artículos</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 font-medium shadow-lg"
              >
                Filtrar por: {filtro} ▼
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-300 shadow-lg">
              <DropdownMenuItem
                onClick={() => setFiltro('Todos')}
                className={`cursor-pointer ${
                  filtro === 'Todos'
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'hover:bg-gray-50'
                }`}
              >
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFiltro('Completos')}
                className={`cursor-pointer ${
                  filtro === 'Completos'
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'hover:bg-gray-50'
                }`}
              >
                Completos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFiltro('Incompletos')}
                className={`cursor-pointer ${
                  filtro === 'Incompletos'
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'hover:bg-gray-50'
                }`}
              >
                Incompletos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-8">
        <ul className="divide-y divide-gray-200">
          {articulosVisibles.map((articulo) => (
            <ArticuloCard key={articulo.id} articulo={articulo} />
          ))}
        </ul>

        <div className="mt-6 text-center text-sm text-gray-500">
          Mostrando {articulosVisibles.length} de {articulosFiltrados.length}{' '}
          artículos
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
    </div>
  );
};
