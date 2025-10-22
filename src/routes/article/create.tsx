import { createFileRoute } from '@tanstack/react-router'
import { getAllUsers, type User } from '@/services/userServices';
import { getAllConferencesGrupo1, type Conference } from '@/services/conferenceServices';
import { useEffect, useState } from 'react';
import ArticleForm from '@/components/article/ArticleForm';

//URL de la página
export const Route = createFileRoute('/article/create')({
  component: RouteComponent,
})

function RouteComponent() {

  //Listas de Usuarios y Conferencias
  const [userList, setUser] = useState<User[]>([]);
  const [conferenceList, setConference] = useState<Conference[]>([]);

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

  //Cuerpo del Componente
  return (
      <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
        {/*Importo el Form y le envío los usuarios y conferencias de la app*/}
        <ArticleForm users={userList} conferences={conferenceList}/>
      </div>
    )
}
