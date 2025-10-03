import React from 'react';
import { Route } from '@/routes/conferencias/$id';
import { Edit, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from '@tanstack/react-router';

export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

function UnaConferencia() {
  const conferencia = Route.useLoaderData();
  const navigate= useNavigate()

  const irEditarConferencia= () =>{
    navigate({to: `/conferencias/editar/${conferencia.id}`})
  }

  const agregarSesion= () =>{

  }   

  return (
      <div className="flex flex-col mt-5 px-8 w-full gap-2 ">
        <div className="flex flex-col gap-1 bg-card rounded shadow border border-gray-200 p-5 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{conferencia.titulo.toUpperCase()}</h1>
            <div onClick={irEditarConferencia} className="cursor-pointer rounded hover:bg-gray-200 p-1">
              <Edit size={'15'} />
            </div>
          </div>

          <p className="text-sm">
            Desde {formatearFecha(conferencia.fecha_ini)} a {formatearFecha(conferencia.fecha_fin)}
          </p>
        </div>

        <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full">
          <h2 className="text-1xl font-bold">Descripción</h2>
          <p>{conferencia.descripcion}</p>
          <h2 className="text-1xl font-bold">Chair general</h2>
          <p>Jose Hernandez</p> {/*conferencia.chair*/}
        </div>

        <div className='flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full'>
          <div className='flex justify-between'>
            <h2 className="text-1xl font-bold">Sesiones disponibles</h2>
            <Button
              size={'sm'}
              onClick={agregarSesion}
              className="cursor-pointer"
            >
              <Plus />
              Nueva sesión
            </Button>
          </div>
        </div>
      </div>
  );
}

export default UnaConferencia;
