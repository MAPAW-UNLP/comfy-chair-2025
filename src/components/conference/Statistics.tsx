import { ArticleStatsChart, type ChartItem } from './ArticleStatsChart';
import { CheckCircle2, XCircle, FileText, PresentationIcon } from 'lucide-react';

type StatisticsProps = {
  fromConference: boolean;
  acceptedArticles?: number;
  rejectedArticles?: number;
  regularArticles?: number;
  posterArticles?: number;
  capacity?: number;
  totalSessions?: number;
  totalArticles?: number;
};

function Statistics({ 
  fromConference, 
  acceptedArticles = 0, 
  rejectedArticles = 0,
  regularArticles = 0,
  posterArticles = 0,
  capacity,
  totalSessions,
  totalArticles
}: StatisticsProps) {
  // Items para el gráfico de estado (aceptados/rechazados)
  const statusItems: ChartItem[] = [
    {
      label: 'Aceptados',
      value: acceptedArticles,
      icon: CheckCircle2,
      colorClass: 'text-green-600',
      gradientClass: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      label: 'Rechazados',
      value: rejectedArticles,
      icon: XCircle,
      colorClass: 'text-red-600',
      gradientClass: 'bg-gradient-to-r from-red-500 to-red-600'
    }
  ];

  // Items para el gráfico de tipo (regular/poster)
  const typeItems: ChartItem[] = [
    {
      label: 'Regular',
      value: regularArticles,
      icon: FileText,
      colorClass: 'text-blue-600',
      gradientClass: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      label: 'Poster',
      value: posterArticles,
      icon: PresentationIcon,
      colorClass: 'text-purple-600',
      gradientClass: 'bg-gradient-to-r from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold">Estadísticas</h2>

      <div className="flex flex-col gap-5">
        {fromConference && totalSessions !== undefined && (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Sesiones</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-blue-600">{totalSessions}</span>
              <span className="text-gray-600">sesiones creadas</span>
            </div>
          </div>
        )}

        {totalArticles !== undefined && (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Artículos enviados</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-purple-600">{totalArticles}</span>
              <span className="text-gray-600">artículos totales</span>
            </div>
          </div>
        )}

        {!fromConference && (
          <>
            <ArticleStatsChart 
              title="Estado de los Artículos"
              items={statusItems}
              capacity={capacity}
              capacityLabel="Cupo máximo de artículos aceptados:"
              capacityValue={acceptedArticles}
            />
            
            <ArticleStatsChart 
              title="Tipo de Artículos"
              items={typeItems}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Statistics;
