import { useEffect, useState, useRef } from 'react';
import { Route } from '@/routes/conference/$id';
import { Edit, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from '@tanstack/react-router';
import { deleteConference } from '@/services/conferenceServices';
import { getUserById, type User } from '@/services/userServices';
import AltaSession from './SessionCreate';
import { getSessionsByConference } from '@/services/sessionServices';
import type { Session } from '@/services/sessionServices';
import SessionCard from './SessionCard';

export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

function AConference() {
  const conferencia = Route.useLoaderData();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [chairs, setChairs]= useState<User[]>([])
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const irEditarConferencia = () => {
    navigate({ to: `/conference/edit/${conferencia.id}` });
  };

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const data = await getSessionsByConference(Number(conferencia.id));
      setSessions(data);
    } catch (error) {
      console.error('Error al cargar las sesiones:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const goToHome = () => {
    navigate({ to: '/conference/view' });
  };

  const handleEliminarConferencia = () => {
    setShowDeleteModal(true);
  };

  const confirmarEliminar = async () => {
    setDeleting(true);
    try {
      await deleteConference(conferencia.id);
      navigate({ to: '/conference/view' }); // Redirigir después de eliminar
    } catch (error) {
      console.error('Error al eliminar conferencia:', error);
      alert('Error al eliminar la conferencia');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelarEliminar = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    let isCancelled = false;

    const getChairs = async () => {
      const chairsIds = conferencia.chairs;
      const users: User[] = [];

      for (const ch of chairsIds!) {
        const user = await getUserById(ch);
        users.push(user);
      }

      if (!isCancelled) {
        setChairs(users);
      }
    };

    getChairs();
    fetchSessions(); // Cargar sesiones al montar el componente

    return () => {
      //Cancelo el seteo de chairs del efecto anterior si cambia conferencia
      isCancelled = true;
    };
  }, [conferencia]);

  // Actualizar botones de scroll cuando cambien las sesiones
  useEffect(() => {
    updateScrollButtons();
    // También actualizar al redimensionar la ventana
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [sessions]);

  return (
    <>
      <div className="flex flex-col mt-5 px-8 w-full gap-2 ">
        <div className="flex flex-col gap-1 bg-card rounded shadow border border-gray-200 p-5 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-2xl font-bold">
              {conferencia.title.toUpperCase()}
            </h1>
            <div
              onClick={irEditarConferencia}
              className="cursor-pointer rounded hover:bg-gray-200 p-1"
            >
              <Edit size={'15'} />
            </div>
          </div>

          <p className="text-sm">
            Desde {formatearFecha(conferencia.start_date)} a{' '}
            {formatearFecha(conferencia.end_date)}
          </p>
        </div>

        <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full">
          <h2 className="text-1xl font-bold">Descripción</h2>
          <p className="break-words">{conferencia.description}</p>
          <h2 className="text-1xl font-bold">Chairs</h2>
          {chairs.map(ch =>{
            return <p key={ch.id}>{ch.full_name}</p> 
          })}
          
        </div>

        <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-1xl font-bold">Sesiones disponibles</h2>
            <AltaSession
              conferenceId={Number(conferencia.id)}
              onSessionCreated={fetchSessions}
              trigger={
                <Button size={'sm'} className="cursor-pointer">
                  <Plus />
                  Nueva sesión
                </Button>
              }
            />
          </div>

          {/* Lista de sesiones con carrusel */}
          {loadingSessions ? (
            <div className="text-center py-4 text-muted-foreground">
              Cargando sesiones...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No hay sesiones creadas aún. Creá la primera sesión.
            </div>
          ) : (
            <div className="relative">
              {/* Botón izquierdo */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900 hover:bg-slate-700 text-white rounded-full p-2 shadow-lg"
                  aria-label="Scroll izquierda"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Contenedor con scroll horizontal */}
              <div
                ref={scrollContainerRef}
                onScroll={updateScrollButtons}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {sessions.map((session) => (
                  <div key={session.id} className="flex-shrink-0 w-[350px]">
                    <SessionCard
                      session={session}
                      onSessionUpdated={fetchSessions}
                    />
                  </div>
                ))}
              </div>

              {/* Botón derecho */}
              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900 hover:bg-slate-700 text-white rounded-full p-2 shadow-lg"
                  aria-label="Scroll derecha"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className='flex justify-between items-center mt-5'>
          <Button variant={"secondary"} className='cursor-pointer bg-slate-900 text-white hover:bg-slate-700' onClick={goToHome}>Volver al inicio</Button>

          <Button
            variant="destructive"
            onClick={handleEliminarConferencia}
            className="flex items-center gap-2 cursor-pointer bg-red-900 text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
            Eliminar conferencia
          </Button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border-2 border-gray-300">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro que deseas eliminar la conferencia "
              {conferencia.title}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelarEliminar}
                className="cursor-pointer"
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmarEliminar}
                className="cursor-pointer bg-red-900 text-white hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AConference;
