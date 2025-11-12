import { ArticleStatsChart, type ChartItem } from './ArticleStatsChart';
import { CheckCircle2, XCircle, FileText, PresentationIcon } from 'lucide-react';

// Tipo para representar una sesión con su cantidad de artículos
export type SessionStats = {
  id: number;
  title: string;
  articleCount: number;
};

type StatisticsProps = {
  fromConference: boolean;
  acceptedArticles?: number;
  rejectedArticles?: number;
  regularArticles?: number;
  posterArticles?: number;
  capacity?: number;
  totalSessions?: number;
  totalArticles?: number;
  sessionsWithArticles?: SessionStats[];
};

function Statistics({ 
  fromConference, 
  acceptedArticles = 0, 
  rejectedArticles = 0,
  regularArticles = 0,
  posterArticles = 0,
  capacity,
  totalSessions,
  sessionsWithArticles = []
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

        {/* Gráfico de artículos por sesión (solo en conferencia) */}
        {fromConference && sessionsWithArticles.length > 0 && (
          <ArticleStatsChart 
            title="Artículos enviados por sesión"
            items={sessionsWithArticles.map((session, index) => {
              // Array de colores para diferenciar las sesiones
              const colors = [
                { colorClass: 'text-blue-600', gradientClass: 'bg-gradient-to-r from-blue-500 to-blue-600' },
                { colorClass: 'text-purple-600', gradientClass: 'bg-gradient-to-r from-purple-500 to-purple-600' },
                { colorClass: 'text-green-600', gradientClass: 'bg-gradient-to-r from-green-500 to-green-600' },
                { colorClass: 'text-orange-600', gradientClass: 'bg-gradient-to-r from-orange-500 to-orange-600' },
                { colorClass: 'text-pink-600', gradientClass: 'bg-gradient-to-r from-pink-500 to-pink-600' },
                { colorClass: 'text-teal-600', gradientClass: 'bg-gradient-to-r from-teal-500 to-teal-600' },
              ];
              const colorIndex = index % colors.length;
              
              return {
                label: session.title,
                value: session.articleCount,
                icon: FileText,
                colorClass: colors[colorIndex].colorClass,
                gradientClass: colors[colorIndex].gradientClass
              };
            })}
          />
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
