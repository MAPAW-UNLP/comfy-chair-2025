// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para la edición de un articulo existente
//
// Funcionalidades principales:
//
// - Recuperar el artículo actual (según el parámetro "articleId" de la URL).
// - Obtener la lista completa de conferencias activas.
// - Obtener la lista completa de usuarios registrados.
// - Mostrar un spinner de carga mientras se recuperan los datos necesarios.
// - Mostrar mensajes informativos si:
//     • El artículo no existe.
//     • El artículo ya no puede editarse (ya pasó la deadilne).
// - Permite navegar hacia:
//     • La pantalla de visualizacion de artículos (al cancelar o editar un articulo).
// - En caso de éxito, renderiza el componente "ArticleForm" y le envía como props 
//   la lista de usuarios, la lista de conferencias activas, el articulo actual y una
//   flag para indicar que el componente se encuentra en modo edicion.
//
// -------------------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { getAllUsers, type User } from '@/services/userServices';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { getActiveConferences } from '@/services/conferenceServices';
import { type Conference } from '@/components/conference/ConferenceApp';
import { getArticleById, type Article } from '@/services/articleServices';
import ArticleForm from '@/components/article/ArticleForm';

export const Route = createFileRoute('/article/edit/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Parametros de entrada (articleId)
  const { articleId } = useParams({ from: '/article/edit/$articleId' });
  const id = Number(articleId);

  // Articulo Actual
  const [article, setArticle] = useState<Article | null>(null);

  // Lista de Conferencias
  const [conferenceList, setConferences] = useState<Conference[]>([]);

  // Lista de Usuarios
  const [userList, setUsers] = useState<User[]>([]);

  // Efecto para recuperar el articulo actual y los usuarios de la app
  useEffect(() => {

    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch {
        console.error("Error al obtener el artículo");
        setArticle(null);
      }
    };

    const fetchUsers = async () => {
      try{
        const data = await getAllUsers();
        setUsers(data);
      }
      catch {
        console.log("Error al obtener los usuarios");
      }
    };

    const fetchConferences = async () => {
      try{
        const conferenceList = await getActiveConferences();
        setConferences(conferenceList);
      }
      catch{
        console.log("Error al obtener las conferencias");
      }
      finally{
        setLoading(false);
      }
    };

    fetchArticle();
    fetchUsers();
    fetchConferences();
  
  }, []);

  // Spinner de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-full">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mensaje si el articulo no existe
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center">
          No se encontró el artículo solicitado...
        </h1>
      </div>
    );
  }

  // Feature de Seguridad - Mensaje si el articulo no debe editarse (solo accesible desde la barra de navegación)
  if (article.status !== "reception" || article.session?.deadline! < Date.now().toString()) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center">
          No se admite la edicion de este articulo...
        </h1>
      </div>
    );
  }
  
  //Cuerpo del Componente
  return (
    <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
      {/* Le envío al form la conferencia actual, el articulo existente y los usuarios de la app */}
      <ArticleForm conferences={conferenceList} users={userList} editMode={true} article={article}  /> 
    </div>
  );

}