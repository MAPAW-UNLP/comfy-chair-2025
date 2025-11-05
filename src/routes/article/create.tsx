// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para el alta de un articulo en una conferencia específica
//
// Funcionalidades principales:
//
// - Obtener la lista completa de conferencias activas.
// - Obtener la lista completa de usuarios registrados.
// - Mostrar un spinner de carga mientras se recuperan los datos necesarios.
// - Renderiza el componente "ArticleForm" y le envía como props la lista de usuarios y 
//   la lista de conferencias activas.
//
// -------------------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { getAllUsers, type User } from '@/services/userServices';
import { getActiveConferences } from '@/services/conferenceServices';
import { type Conference } from '@/components/conference/ConferenceApp';
import ArticleForm from '@/components/article/ArticleForm';

export const Route = createFileRoute('/article/create')({
  component: RouteComponent,
})

function RouteComponent() {

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Lista de Conferencias
  const [conferenceList, setConferences] = useState<Conference[]>([]);

  // Lista de Usuarios
  const [userList, setUsers] = useState<User[]>([]);

  // Efecto para recuperar las conferencias y los usuarios
  useEffect(() => {

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

  //Cuerpo del Componente
  return (
    <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
      {/* Le envío al form la lista de conferencias y la lista de usuarios */}
      <ArticleForm conferences={conferenceList} users={userList} />
    </div>
  );

}
