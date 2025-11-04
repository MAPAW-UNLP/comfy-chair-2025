// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para la visualización de artículos de una conferencia específica
//
// Funcionalidades principales:
//
// - Recuperar la conferencia actual (según el parámetro "conferenceId" de la URL)
// - Obtener la lista completa de artículos asociados a la conferencia actual
// - Mostrar un spinner de carga mientras se recuperan los datos necesarios.
// - Mostrar mensajes informativos si:
//     • La conferencia no existe.
//     • No hay artículos disponibles para mostrar.
// - Permite navegar hacia:
//     • La pantalla de creación de artículos (si la conferencia no ha finalizado).
//     • Una ruta de retorno ("article/test"). PROVISORIA HASTA TENER EL DASHBOARD.
// - En caso de éxito, renderiza cada articulo como un componente "ArticleCard", enviándole
//   como prop a cada uno el articulo actual.
//
// -------------------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Article } from '@/services/articleServices';
import { getArticlesByConferenceId } from '@/services/articleServices';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { getConferenceById, type ConferenceG1 } from '@/services/conferenceServices';
import ArticleCard from '@/components/article/ArticleCard';

export const Route = createFileRoute('/article/$conferenceId/view')({
  component: RouteComponent,
})

function RouteComponent() {

  // Navegacion
  const navigate = useNavigate();
  const handleCreate = () => navigate({ to: `/article/${id}/create`, replace: true });
  const handleBack = () => navigate({ to: `/article/test`, replace: true }); // RUTA PROVISORIA

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Parametros de entrada (conferenceId)
  const { conferenceId } = useParams({ from: '/article/$conferenceId/view' });
  const id = Number(conferenceId);

  //Conferencia Actual
  const [conference, setConference] = useState<ConferenceG1 | null>();

  // Lista de Articulos
  const [articulo, setArticulos] = useState<Article[]>([]);

  // Efecto para recuperar la conferencia actual y sus articulos
  useEffect(() => {

    const fetchArticles = async () => {
      try{
        const data = await getArticlesByConferenceId(id);
        const ordenados = [...data].sort((a, b) => b.id - a.id);
        setArticulos(ordenados);
      }
      catch{
        console.log("Error al obtener los articulos");
      }
    };

    const fetchConference = async () => {
      try{
        const conference = await getConferenceById(id);
        setConference(conference);
      }
      catch{
        console.log("Error al obtener la conferencia");
      }
      finally{
        setLoading(false);
      }
    };

    fetchArticles();
    fetchConference();
    
  }, []);

  // Spinner de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-full">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mensaje si la conferencia no existe
  if (!conference) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center">
          No se encontró la conferencia solicitada...
        </h1>
      </div>
    );
  }

  //Cuerpo del Componente
  return (
    <div className="mx-4 my-4 flex flex-col items-center gap-4">
      
      {/* Titulo de la conferencia*/}
      <h1 className="text-2xl font-bold italic text-slate-500 text-center">
        Conferencia: {conference.title}
      </h1>
      
      {/* Botones de navegacion */}
      <div className="flex flex-col sm:flex-row sm:w-100 w-auto gap-4">
        <Button variant="outline" className="bg-zinc-500 text-white flex-1" onClick={handleBack}>
          Volver
        </Button>
        { new Date(conference.end_date).getTime() >= Date.now() && (
          <Button variant="outline" className="bg-lime-900 text-white flex-1" onClick={handleCreate}>
            Subir Artículo +
          </Button>
        )}
      </div>
      
      {/* Si hay articulos mapea cada uno como una card, sino muestra un mensaje */}
      {articulo.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
          <h1 className="text-2xl font-bold italic text-slate-500 text-center">
            No hay artículos para mostrar...
          </h1>
        </div>
      ) : (
        <div className="flex flex-wrap w-full gap-4 justify-center">
          {/* Le envío a cada card el id del articulo y el objeto articulo correspondiente*/}
          {articulo.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );

}