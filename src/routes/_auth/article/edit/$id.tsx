import { createFileRoute, useParams } from '@tanstack/react-router'
import { getAllUsers, type User } from '@/services/userServices';
import { getAllConferencesGrupo1, type Conference } from '@/services/conferenceServices';
import { getArticleById, type Article } from '@/services/articleServices';
import { useEffect, useState } from 'react';
import ArticleForm from '@/components/article/ArticleForm';

export const Route = createFileRoute('/_auth/article/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/_auth/article/edit/$id' });
  const articleId = Number(id);

  //Listas de Usuarios y Conferencias
  const [userList, setUser] = useState<User[]>([]);
  const [conferenceList, setConference] = useState<Conference[]>([]);
  const [article, setArticle] = useState<Article | undefined>(undefined);


  //Recupera usuarios del server ni bien se abre la pestaña
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUser(data);
    };
    fetchUsers();
  }, []);

  //Recupera conferencias del server ni bien se abre la pestaña
  useEffect(() => {
    const fetchConferences = async () => {
      const data = await getAllConferencesGrupo1();
      setConference(data);
      console.log(data);
    };
    fetchConferences();
  }, []);

    // Fetch del artículo actual
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(articleId);
        setArticle(data);
      } catch (error) {
        console.error("Error al obtener el artículo:", error);
      }
    };
    fetchArticle();
  }, [articleId]);
  
  //Cuerpo del Componente
  return (
      <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
        {/*Importo el Form y le envío los usuarios y conferencias de la app*/}
        <ArticleForm users={userList} conferences={conferenceList} editMode={true} article={article} /> 
      </div>
    )
}

