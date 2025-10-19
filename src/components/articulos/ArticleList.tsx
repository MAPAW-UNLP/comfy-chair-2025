import { useState, useEffect, useRef } from 'react';
import type { Article } from '@/services/articles';
import { ArticleCard } from './ArticleCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticleListProps {
  items: Article[];
}

const filterOptions = ['Sin Filtros', 'Completos', 'Incompletos'] as const;

export const ArticleList = ({ items }: ArticleListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'Sin Filtros' | 'Completos' | 'Incompletos'>(
    'Sin Filtros'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const itemsPerPagina = 5;

  const isComplete = (article: Article) => {
    return article.reviewers?.length === 3;
  };

  // Filtra según selección
  const filteredArticles = items.filter((articulo) => {
    if (filter === 'Sin Filtros') return true;
    if (filter === 'Completos') return isComplete(articulo);
    if (filter === 'Incompletos') return !isComplete(articulo);
    return true;
  });

  // Resetea a página 1 cuando cambia el filter
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPagina);
  const initialIndex = (currentPage - 1) * itemsPerPagina;
  const visibleArticles = filteredArticles.slice(
    initialIndex,
    initialIndex + itemsPerPagina
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const lastPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Oculta al hacer click afuera
  useEffect(() => {
    function closeMenu(e: MouseEvent) {
      const el = menuRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
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
            Todos los artículos - {filter}
            <ChevronDown className="w-4 h-4" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 border rounded-lg shadow-lg z-50">
              {filterOptions.map((opcion, index) => (
                <button
                  key={opcion}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${filter === opcion ? 'bg-gray-100 font-medium' : ''
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filterOptions.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  onClick={() => {
                    setFilter(opcion);
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
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex-1 flex items-center justify-center">
            No se encontraron artículos
          </div>
        ) : (
          <>
            {/* Lista */}
            <div className="divide-y divide-gray-400 flex-1 overflow-y-auto">
              {visibleArticles.map((articulo) => (
                <ArticleCard key={articulo.id} article={articulo} />
              ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-800 text-white py-4 px-6 flex-shrink-0">
              <div className="flex justify-center items-center gap-4">
                {totalPages > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={lastPage}
                    disabled={currentPage === 1}
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                <p className="text-sm">
                  Mostrando {initialIndex + visibleArticles.length} artículos de{' '}
                  {filteredArticles.length}
                </p>

                {totalPages > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
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
