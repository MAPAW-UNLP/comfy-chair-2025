import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getAllSessions } from '@/services/sessionServices';

export const SessionList = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);


  const handleSessionClick = (sessionId: number) => {
    navigate({
      to: '/chairs/selection/articles-session',
      search: { sessionId: String(sessionId) }
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Cargando sesiones...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="text-white py-4 px-6 flex justify-center items-center flex-shrink-0" style={{ backgroundColor: 'var(--ring)' }}>
        <h1 className="text-xl font-semibold">Sesiones de la Conferencia</h1>
      </div>

      {/* Lista de sesiones */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--sidebar-border)' }}>
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex-1 flex items-center justify-center">
            No se encontraron sesiones
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-400">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full"
                  onClick={() => handleSessionClick(session.id)}
                >
                    {/* Título */}
                    <div className="flex-1 pr-4">
                        <h3 className="text-base text-gray-900 leading-tight">{session.title}</h3>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-500">
                            Ver Artículos
                        </span>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};