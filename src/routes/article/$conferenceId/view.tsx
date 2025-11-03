import { getArticlesByConferenceId } from '@/services/articleServices';
import type { Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { getConferenceTitleById } from '@/services/conferenceServices';

export const Route = createFileRoute('/article/$conferenceId/view')({
  component: RouteComponent,
})

function RouteComponent() {

  // Parametros de entrada
  const { conferenceId } = useParams({ from: '/article/$conferenceId/view' });
  const id = Number(conferenceId);

  // Navegacion
  const navigate = useNavigate();
  const handleClick = () => navigate({ to: `/article/${id}/create`, replace: true });

  //Conferencia
  const [conferenceTitle, setConferenceTitle] = useState<String>();

  // Lista de Articulos
  const [articulo, setArticulos] = useState<Article[]>([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Efecto para traer todos los articulos por id de conferencia
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArticlesByConferenceId(id);
        const ordenados = [...data].sort((a, b) => b.id - a.id);
        setArticulos(ordenados);
        const title = await getConferenceTitleById(id);
        setConferenceTitle(title ?? ""); // si es null, se asigna ""
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

    
  //Spinner de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-full">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  //Cuerpo del Componente
  return (
    <div className="mx-4 my-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold italic text-slate-500 text-center">
        Conferencia: {conferenceTitle ?? "?"}
      </h1>
      <Button variant="outline" className="bg-lime-900 text-white" onClick={handleClick}>
        Subir Artículo +
      </Button>
      {articulo.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
          <h1 className="text-2xl font-bold italic text-slate-500 text-center">
            No hay artículos para mostrar...
          </h1>
        </div>
      ) : (
        <div className="flex flex-wrap w-3/4 gap-4 justify-center">
          {articulo.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );

}