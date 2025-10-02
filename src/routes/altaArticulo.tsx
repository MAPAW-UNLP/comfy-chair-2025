import { createFileRoute } from '@tanstack/react-router'
import AltaArticulo from '@/components/articulo/altaArticulo';
import { getAllUsers, type User } from '@/services/users';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/altaArticulo')({
  component: RouteComponent,
})

function RouteComponent() {

const [userList, setUser] = useState<User[]>([]);

  // recupera usuarios del server ni bien se abre la app
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUser(data);
    };
    fetchUsers();
  }, []);

  return (
      <div className="flex flex-wrap gap-4 mx-4 justify-center">
        <AltaArticulo users={userList}/>
      </div>
    )
}
