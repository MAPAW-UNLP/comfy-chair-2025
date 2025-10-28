import { useState, useEffect } from 'react';
import { getAllSessions } from '@/services/sessionServices';

interface SessionListProps {
  onSessionSelect: (sessionId: number, sessionTitle: string) => void;
}

export const SessionList = ({ onSessionSelect }: SessionListProps) => {
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
        <h1 className="text-xl font-semibold">Selecciona una Sesión</h1>
      </div>

      {/* Lista de sesiones */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--sidebar-border)' }}>
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex-1 flex items-center justify-center">
            No se encontraron sesiones
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSessionSelect(session.id, session.title)}
                >
                  <h3 className="font-semibold text-lg text-gray-900">{session.title}</h3>
                  <p className="text-gray-600 mt-1">Capacidad: {session.capacity || 'No definida'} artículos</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};