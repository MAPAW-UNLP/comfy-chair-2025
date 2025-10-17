import { useState, useEffect, useRef } from 'react';
import type { Article } from '@/services/articulos';
import { ArticuloCard } from './ArticuloCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ListaArticulosProps {
  items: Article[];
}

const opcionesFiltro = ['Sin Filtros', 'Completos', 'Incompletos'] as const;

export const ListaArticulos = ({ items }: ListaArticulosProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState<'Sin Filtros' | 'Completos' | 'Incompletos'>(
    'Sin Filtros'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const itemsPorPagina = 5;

  const estaCompleto = (articulo: Article) => {
    return articulo.revisores?.length === 3;
  };

  // Filtra según selección
  const articulosFiltrados = items.filter((articulo) => {
    if (filtro === 'Sin Filtros') return true;
    if (filtro === 'Completos') return estaCompleto(articulo);
    if (filtro === 'Incompletos') return !estaCompleto(articulo);
    return true;
  });

  // Resetea a página 1 cuando cambia el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  const totalPaginas = Math.ceil(articulosFiltrados.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const articulosVisibles = articulosFiltrados.slice(
    indiceInicial,
    indiceInicial + itemsPorPagina
  );

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  // Oculta al hacer click afuera
  useEffect(() => {
    function cerrarMenu(e: MouseEvent) {
      const el = menuRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', cerrarMenu);
    return () => document.removeEventListener('mousedown', cerrarMenu);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div
        className="text-white py-4 px-6 flex justify-center items-center flex-shrink-0"
        style={{ backgroundColor: 'var(--ring)' }}
      >
        {/* Filtro */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="outline"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-full shadow-sm"
          >
            Todos los artículos - {filtro}
            <ChevronDown className="w-4 h-4" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 border rounded-lg shadow-lg z-50">
              {opcionesFiltro.map((opcion, index) => (
                <button
                  key={opcion}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${filtro === opcion ? 'bg-gray-100 font-medium' : ''
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === opcionesFiltro.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  onClick={() => {
                    setFiltro(opcion);
                    setMenuOpen(false);
                  }}
                >
                  {opcion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de artículos */}
      <div className="flex-1 overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--sidebar-border)' }}>
        {articulosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex-1 flex items-center justify-center">
            No se encontraron artículos
          </div>
        ) : (
          <>
            {/* Lista */}
            <div className="divide-y divide-gray-400 flex-1 overflow-y-auto">
              {articulosVisibles.map((articulo) => (
                <ArticuloCard key={articulo.id} articulo={articulo} />
              ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-800 text-white py-4 px-6 flex-shrink-0">
              <div className="flex justify-center items-center gap-4">
                {totalPaginas > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={paginaAnterior}
                    disabled={paginaActual === 1}
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                <p className="text-sm">
                  Mostrando {indiceInicial + articulosVisibles.length} artículos de{' '}
                  {articulosFiltrados.length}
                </p>

                {totalPaginas > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={siguientePagina}
                    disabled={paginaActual === totalPaginas}
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
