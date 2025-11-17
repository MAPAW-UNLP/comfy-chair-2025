import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
import { getArticlesBySessionAndStatus } from '@/services/selectionServices';

type ReviewArticleListProps = {
  sessionId: number;
  status: 'accepted' | 'rejected';
};

export const ReviewArticleList = ({
  sessionId,
  status,
}: ReviewArticleListProps) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const headerText =
    status === 'accepted' ? 'Artículos Aceptados' : 'Artículos Rechazados';

  useEffect(() => {
    const fetchArticles = async () => {
      if (sessionId <= 0 || isNaN(sessionId)) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Llama al servicio para obtener los artículos filtrados del back
        const data = await getArticlesBySessionAndStatus(sessionId, status);
        setArticles(data);
      } catch (error) {
        console.error(`Error fetching ${status} articles:`, error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [sessionId, status]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          Cargando {headerText.toLowerCase()}...{' '}
        </div>
      </div>
    );
  }

  const listContent = (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="divide-y divide-gray-200">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full"
          >
            <div className="flex-1 pr-4">
              <h3 className="text-base text-gray-900 font-medium leading-snug">
                {article.title}
              </h3>
            </div>

            {/* Puntaje promedio */ }
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-gray-400">Puntaje Promedio</p>
              <p className="text-base font-bold text-gray-700 mt-1">
                {article.avg_score?.toFixed(2) ?? 'N/A'}{' '} {/* formato de 2 decimales o si no existe devuelve Not Available*/}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div
        className="text-white py-4 px-6 flex items-center flex-shrink-0 relative"
        style={{ backgroundColor: '#555353ff' }}
      >
        <h1 className="text-xl font-semibold mx-auto">{headerText}</h1>
      </div>

      {/* Subheader verde/rojo */}
      <div className="py-2 px-6 flex flex-col items-start justify-between flex-shrink-0 bg-gray-100 border-b border-gray-300">
        <p
          className={`text-lg font-bold mt-1 ${status === 'accepted' ? 'text-green-700' : 'text-red-700'}`}
        >
          {status === 'accepted' ? 'Artículos que pasaron el filtro' : 'Artículos que no pasaron el filtro'} (
          {articles.length})
        </p>
      </div>

      {/* Lista de artículos */}
      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--sidebar-border)' }}
      >
        {listContent}
      </div>
    </div>
  );
};
