import { createFileRoute, useParams } from '@tanstack/react-router'
import { getAllUsers, type User } from '@/services/userServices';
import { useEffect, useState } from 'react';
import ArticleForm from '@/components/article/ArticleForm';

export const Route = createFileRoute('/article/$conferenceId/create')({
  component: RouteComponent,
})

function RouteComponent() {

  // Parametros de entrada
  const { conferenceId } = useParams({ from: '/article/$conferenceId/create' });
  const id = Number(conferenceId);

  //Listas de Usuarios y Conferencias
  const [userList, setUser] = useState<User[]>([]);

  //Recupera usuarios del server ni bien se abre la pestaña
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUser(data);
    };
    fetchUsers();
  }, []);

  //Cuerpo del Componente
  return (
      <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
        {/*Importo el Form y le envío los usuarios y conferencias de la app*/}
        <ArticleForm users={userList} conferenceId={id} />
      </div>
    )
}
