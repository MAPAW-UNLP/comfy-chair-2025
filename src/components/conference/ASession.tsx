/* Componente que muestra una sesión individual */

import { useState, useEffect } from 'react';
import { axiosInstance as api } from '@/services/api';
import { deleteSession, type Session } from '@/services/sessionServices';
import { Loader2, Trash2 } from 'lucide-react';
import { Route } from '@/routes/conference/session/$id';
import { formatearFecha } from './AConference';
import { Button } from '../ui/button';
import ModalEliminar from './ModalEliminar';
import { useNavigate } from '@tanstack/react-router';
import EditarSession from './EditarSession';
// import { CarouselContainer, CarouselItem } from '@/components/ui/carousel-container';

function ASession() {
  const sessionInicial = Route.useLoaderData();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(sessionInicial);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/session/${sessionInicial.id}/`);
      setSession(response.data);
    } catch (error) {
      console.error('Error al cargar la sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('A ver la sesion, ', sessionInicial);
    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const goToConferencia = () => {
    navigate({to: `/conference/${session!.conference?.id}`})
  };

  const handleEliminarSession = () => {
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    await deleteSession(String(session!.id));
    navigate({ to: `/conference/${session!.conference?.id}` });
  }

  return (
    <div className="flex flex-col mt-5 px-8 w-full gap-2 ">
      <div className="flex flex-col gap-1 bg-card rounded shadow border border-gray-200 p-5 w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col ">
            <span className="text-sm font-medium">Sesión</span>
            <h1 className="text-lg sm:text-2xl font-bold">
              {session!.title.toUpperCase()}
            </h1>
          </div>
          <EditarSession 
            session={session!} 
            onSessionUpdated={fetchSession}
          />
        </div>
        <p className="text-sm">Deadline {formatearFecha(session!.deadline)}</p>
      </div>

      <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full">
        <h2 className="text-1xl font-bold">
          Cupo máximo de artículos aceptados
        </h2>
        <span className="font-medium text-2xl text-blue-800">
          {session!.capacity}
        </span>
      </div>

      <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full gap-4">
        <h2 className="text-1xl font-bold">Artículos</h2>
        {/* TODO: Cargar artículos desde el backend */}
        {/* Ejemplo de cómo usar el carrusel cuando tengas los artículos: */}
        {/* 
        <CarouselContainer>
          {articles.map((article) => (
            <CarouselItem key={article.id} width="350px">
              <ArticleCard article={article} />
            </CarouselItem>
          ))}
        </CarouselContainer>
        */}
        <div className="text-center py-4 text-muted-foreground">
          No hay artículos asignados
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-5 m-2 gap-3">
        <Button
          variant={'secondary'}
          className="cursor-pointer bg-slate-900 text-white hover:bg-slate-700"
          onClick={goToConferencia}
        >
          Volver a {session!.conference?.title}
        </Button>

        <Button
          variant="destructive"
          onClick={handleEliminarSession}
          className="flex items-center gap-2 cursor-pointer bg-red-900 text-white hover:bg-red-700"
        >
          <Trash2 size={16} />
          Eliminar sesión
        </Button>
      </div>

      {showDeleteModal && <ModalEliminar onDelete={onDelete} title={session!.title} isConference={false} cerrar={() => setShowDeleteModal(false)} />}
    </div>
  );
}

export default ASession;
