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
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-gray-400">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full"
          >
            <div className="flex-1 pr-4">
              <h3 className="text-base text-gray-900 font-medium leading-tight">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Puntaje Promedio: {article.avg_score?.toFixed(2) ?? 'N/A'} {/* formato de 2 decimales o si no existe devuelve Not Available*/}
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
        className="text-white py-4 px-6 flex justify-center items-center flex-shrink-0"
        style={{ backgroundColor: 'var(--ring)' }}
      >
        <h1 className={`text-xl font-semibold`}>{headerText}</h1>
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
