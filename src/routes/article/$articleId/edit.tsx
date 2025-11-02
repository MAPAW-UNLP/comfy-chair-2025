import { createFileRoute, useParams } from '@tanstack/react-router'
import { getAllUsers, type User } from '@/services/userServices';
import { getAllConferencesGrupo1, type ConferenceG1 } from '@/services/conferenceServices';
import { getArticleById, type Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleForm from '@/components/article/ArticleForm';

export const Route = createFileRoute('/article/$articleId/edit')({
  component: RouteComponent,
})

function RouteComponent() {

  // Parametros de entrada
  const { articleId } = useParams({ from: '/article/$articleId/edit' });
  const id = Number(articleId);

  // Articulo actual + Listas de Usuarios y Conferencias
  const [article, setArticle] = useState<Article | null>(null);
  const [userList, setUser] = useState<User[]>([]);
  const [conferenceList, setConference] = useState<ConferenceG1[]>([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Efecto para traer los usuarios ni bien se abre la pestaña
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUser(data);
    };
    fetchUsers();
  }, []);

  // Efecto apra traer las conferencias ni bien se abre la pestaña
  useEffect(() => {
    const fetchConferences = async () => {
      const data = await getAllConferencesGrupo1();
      setConference(data);
      console.log(data);
    };
    fetchConferences();
  }, []);

  // Efecto para traer el articulo actual
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Error al obtener el artículo:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

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
  
  //Cuerpo del Componente
  return (
      <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
        {/*Importo el Form y le envío los usuarios y conferencias de la app*/}
        <ArticleForm users={userList} conferences={conferenceList} editMode={true} article={article} /> 
      </div>
    )
}
