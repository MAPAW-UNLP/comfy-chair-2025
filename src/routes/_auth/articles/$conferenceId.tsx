// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para la visualización de artículos de una conferencia específica
//
// Funcionalidades principales:
//
// - Recuperar la conferencia actual (según el parámetro "conferenceId" de la URL).
// - Obtener la lista completa de artículos asociados a la conferencia actual.
// - Mostrar un spinner de carga mientras se recuperan los datos necesarios.
// - Mostrar mensajes informativos si:
//     • La conferencia no existe.
//     • No hay artículos disponibles para mostrar.
// - Permite navegar hacia:
//     • Una ruta de retorno ("article/test"). PROVISORIA HASTA TENER EL DASHBOARD.
// - En caso de éxito, renderiza cada articulo como un componente "ArticleCard" y le envía
//   como prop a cada uno el articulo actual.
//
// -------------------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CornerUpLeftIcon } from 'lucide-react';
import { type Article } from '@/services/articleServices';
import ArticleCard from '@/components/article/ArticleCard';
import { getConferenceById } from '@/services/conferenceServices';
import { getArticlesByConferenceId } from '@/services/articleServices';
import { type Conference } from '@/components/conference/ConferenceApp';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/articles/$conferenceId')({
  component: RouteComponent,
})

function RouteComponent() {

  // Navegacion
  const navigate = useNavigate();
  const handleBack = () => navigate({ to: `/dashboard`, replace: true });

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Parametros de entrada (conferenceId)
  const { conferenceId } = useParams({ from: '/_auth/articles/$conferenceId' });
  const id = Number(conferenceId);

  //Conferencia Actual
  const [conference, setConference] = useState<Conference | null>();

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
          <div className="grid place-items-center w-full min-h-[calc(100dvh-64px)]">
              <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  // Mensaje si la conferencia no existe
  if (!conference) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[calc(100dvh-64px)]">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center">
          No se encontró la conferencia solicitada...
        </h1>
      </div>
    );
  }

  //Cuerpo del Componente
  return (
    <div className="mx-4 my-4 flex flex-col items-center gap-4">
 
      {/* Título de Conferencia y Botón de navegación */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center sm:text-left flex-1">
          Conferencia: {conference.title}
        </h1>
        <Button variant="outline" className="bg-zinc-500 text-white sm:w-auto w-full flex justify-center items-center gap-2" onClick={handleBack}>
          Volver
          <CornerUpLeftIcon />
        </Button>
      </div>
      
      {/* Si hay articulos mapea cada uno como una card, sino muestra un mensaje */}
      {articulo.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
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