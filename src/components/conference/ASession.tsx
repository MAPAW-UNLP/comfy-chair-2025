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
import EditarSession from './SessionEdit';
import { getAllUsers, type User } from '@/services/userServices';
import {
  getArticleBySessionId,
  type Article,
} from '@/services/articleServices';
import { CarouselContainer, CarouselItem } from '../ui/carousel-container';
import ArticleCard from '../article/ArticleCard';
import { toast } from 'sonner';

function ASession() {
  const sessionInicial = Route.useLoaderData();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(sessionInicial);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chairs, setChairs] = useState<User[] | []>([]);
  const [articles, setArticles] = useState<Article[] | []>([]);
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

  const goToConferencia = () => {
    navigate({ to: `/conference/${session!.conference?.id}` });
  };

  const handleEliminarSession = () => {
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    await deleteSession(String(session!.id));
    toast.warning('Sesión eliminada');
    navigate({ to: `/conference/${session!.conference?.id}` });
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchChairs = async () => {
      const data = await getAllUsers();
      setChairs(data.filter((user) => session?.chairs.includes(user.id)));
    };
    fetchChairs();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await getArticleBySessionId(session!.id);
      setArticles(response);
    };

    if (session) fetchArticles();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
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
          <EditarSession session={session!} onSessionUpdated={fetchSession} />
        </div>
        <p className="text-sm">Deadline {formatearFecha(session!.deadline)}</p>
      </div>

      <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full gap-2">
        <h2 className="text-1xl font-bold">
          Cupo máximo de artículos aceptados
        </h2>
        <span className="font-medium text-2xl text-blue-800">
          {session!.capacity}
        </span>
        <h2 className="text-1xl font-bold">Chairs</h2>
        <p>
          {chairs.map((ch) => {
            return <span key={ch.id}>{ch.full_name} </span>;
          })}
        </p>
      </div>

      <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full gap-4">
        <h2 className="text-1xl font-bold">Artículos</h2>
        {articles.length > 0 ? (
          <CarouselContainer>
            {articles.map((article) => (
              <CarouselItem key={article.id} width="350px">
                <ArticleCard
                  title={article.title}
                  session={session!.title}
                  conference={session!.conference!.title}
                  state={article.status}
                  deadline={session?.deadline!}
                />
              </CarouselItem>
            ))}
          </CarouselContainer>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay artículos asignados
          </div>
        )}
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

      {showDeleteModal && (
        <ModalEliminar
          onDelete={onDelete}
          title={session!.title}
          isConference={false}
          cerrar={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default ASession;
