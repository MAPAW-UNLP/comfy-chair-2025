// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para el alta de un articulo en una conferencia específica
//
// Funcionalidades principales:
//
// - Recuperar la conferencia actual (según el parámetro "conferenceId" de la URL)
// - Obtener la lista completa de usuarios del sistema
// - Mostrar un spinner de carga mientras se recuperan los datos necesarios.
// - Mostrar mensajes informativos si:
//     • La conferencia no existe.
//     • La conferencia ya finalizó (no se permiten nuevas altas).
// - Permite navegar hacia:
//     • La pantalla de visualizacion de artículos (al cancelar o subir un articulo).
// - En caso de éxito, renderiza el componente "ArticleForm", enviándole como props 
//   la lista de usuarios y el id de la conferencia actual.
//
// -------------------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { getAllUsers, type User } from '@/services/userServices';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { getConferenceById, type ConferenceG1 } from '@/services/conferenceServices';
import ArticleForm from '@/components/article/ArticleForm';

export const Route = createFileRoute('/article/$conferenceId/create')({
  component: RouteComponent,
})

function RouteComponent() {

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Parametros de entrada (conferenceId)
  const { conferenceId } = useParams({ from: '/article/$conferenceId/create' });
  const id = Number(conferenceId);

  // Conferencia Actual
  const [conference, setConference] = useState<ConferenceG1 | null>();

  // Lista de Usuarios
  const [userList, setUser] = useState<User[]>([]);

  // Efecto para recuperar la conferencia actual y los usuarios de la app
  useEffect(() => {

    const fetchUsers = async () => {
      try{
        const data = await getAllUsers();
        setUser(data);
      }
      catch {
        console.log("Error al obtener los usuarios");
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

    fetchUsers();
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

  // Feature de Seguridad - Mensaje si la conferencia está finalizada (solo accesible desde la barra de navegación)
  if (new Date(conference.end_date).getTime() <= Date.now()) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full">
        <h1 className="text-2xl font-bold italic text-slate-500 text-center">
          No se admiten nuevas altas de articulos en esta conferencia...
        </h1>
      </div>
    );
  }

  //Cuerpo del Componente
  return (
    <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center">
      {/* Le envío al form la conferencia actual y los usuarios de la app */}
      <ArticleForm users={userList} conferenceId={id} />
    </div>
  );

}
