import { createFileRoute } from '@tanstack/react-router'
import AltaArticulo from '@/components/articulo/altaArticulo';
import { getAllUsers, type User } from '@/services/users';
import { getAllConferences, type Conference } from '@/services/conferences';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/altaArticulo')({
  component: RouteComponent,
})

function RouteComponent() {

  const [userList, setUser] = useState<User[]>([]);
  const [conferenceList, setConference] = useState<Conference[]>([]);

  // recupera usuarios del server ni bien se abre la pestaña
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUser(data);
    };
    fetchUsers();
  }, []);

  // recupera conferencias del server ni bien se abre la pestaña
  useEffect(() => {
    const fetchConferences = async () => {
      const data = await getAllConferences();
      setConference(data);
      console.log(data);
    };
    fetchConferences();
  }, []);

  return (
      <div className="flex flex-wrap gap-4 mx-4 justify-center">
        <AltaArticulo users={userList} conferences={conferenceList}/>
      </div>
    )
}
