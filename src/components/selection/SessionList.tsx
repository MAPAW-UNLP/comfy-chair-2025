import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getSessionsByConference } from '@/services/sessionServices';
import { getActiveConferences } from '@/services/conferenceServices';

type SessionListProps = {
  conferenceId: number;
};

export const SessionList = ({ conferenceId }: SessionListProps) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado provisorio: si el ID de la conferencia no se pasa por la url se obtiene un id de la bbdd
  const [auxConferenceId, setAuxConferenceId] = useState(0);

  const conferenceTitle =
    sessions.length > 0 && sessions[0].conference
      ? sessions[0].conference.title
      : 'Sesiones'; // Fallback si la lista esta vacía o el objeto conference es null

  // Determina el ID de la conferencia a usar
  useEffect(() => {
    // Si recibe un ID válido por prop se usa
    if (conferenceId > 0 && !isNaN(conferenceId)) {
      setAuxConferenceId(conferenceId);
      return;
    }

    // Si el ID es inválido (no se navego desde la vista de la conferencia) se busca el fallback
    const fetchFallbackConference = async () => {
      setLoading(true); // Bloquea la carga hasta tener un ID
      try {
        const activeConferences = await getActiveConferences();
        if (activeConferences && activeConferences.length > 0) {
          const firstId = Number(activeConferences[0].id);
          setAuxConferenceId(firstId);
        } else {
          setAuxConferenceId(0); // No hay conferencias activas en la bbdd
        }
      } catch (error) {
        console.error('Error fetching fallback conference:', error);
        setAuxConferenceId(0);
      }
    };

    fetchFallbackConference();
  }, [conferenceId]); // Solo se ejecuta cuando el prop conferenceId cambia

  // Carga las sesiones usando el ID efectivo
  useEffect(() => {
    const fetchSessions = async (id: number) => {
      // Valida que el id sea mayor a 0 antes de llamar a la API
      if (id <= 0 || isNaN(id)) {
        setLoading(false);
        setSessions([]);
        return;
      }

      setLoading(true);
      try {
        // Usa el id buscado para el filtrado
        const data = await getSessionsByConference(id);
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    // Si auxConferenceId es v+alido llama a la funcion de fetch
    if (auxConferenceId > 0) {
      fetchSessions(auxConferenceId);
    } else if (conferenceId <= 0 || isNaN(conferenceId)) {
      // Si el ID inicial es 0 o nan y el fallback también es 0, termina la carga
      setLoading(false);
    }
  }, [auxConferenceId]); // Se ejecuta cuando auxConferenceId se actualiza

  const handleSessionClick = (sessionId: number) => {
    navigate({
      to: '/chairs/selection/articles-session',
      search: { sessionId: String(sessionId) },
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
      <div
        className="text-white py-4 px-6 flex justify-center items-center flex-shrink-0"
        style={{ backgroundColor: 'var(--ring)' }}
      >
        <h1 className="text-xl font-semibold">{conferenceTitle}</h1>
      </div>

      {/* Lista de sesiones */}
      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--sidebar-border)' }}
      >
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
                  <div className="flex-1 pr-4">
                    <h3 className="text-base text-gray-900 leading-tight">
                      {session.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-500">Ver Más</span>
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
