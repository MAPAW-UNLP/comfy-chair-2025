import { ArticleStatsChart } from './ArticleStatsChart';

type StatisticsProps = {
  fromConference: boolean;
  acceptedArticles?: number;
  rejectedArticles?: number;
  capacity?: number;
  totalSessions?: number;
  totalArticles?: number;
};

function Statistics({ 
  fromConference, 
  acceptedArticles = 0, 
  rejectedArticles = 0,
  capacity,
  totalSessions,
  totalArticles
}: StatisticsProps) {
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
          <div>
            <ArticleStatsChart 
              accepted={acceptedArticles} 
              rejected={rejectedArticles}
              capacity={capacity}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
