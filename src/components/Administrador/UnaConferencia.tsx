import React, { useState } from 'react';
import { Route } from '@/routes/conferencias/$id';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from '@tanstack/react-router';
import { deleteConferencia } from '@/services/conferencias';

export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

function UnaConferencia() {
  const conferencia = Route.useLoaderData();
  const navigate= useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const irEditarConferencia= () =>{
    navigate({to: `/conferencias/editar/${conferencia.id}`})
  }

  const agregarSesion= () =>{

  }

  const handleEliminarConferencia = () => {
    setShowDeleteModal(true);
  }

  const confirmarEliminar = async () => {
    setDeleting(true);
    try {
      await deleteConferencia(conferencia.id);
      navigate({to: '/admin'}); // Redirigir después de eliminar
    } catch (error) {
      console.error('Error al eliminar conferencia:', error);
      alert('Error al eliminar la conferencia');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  const cancelarEliminar = () => {
    setShowDeleteModal(false);
  }   

  return (
    <>
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

        {/* Botón Eliminar Conferencia */}
        <div className="flex justify-end mt-4">
          <Button
            variant="destructive"
            onClick={handleEliminarConferencia}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Eliminar conferencia
          </Button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar la conferencia "{conferencia.titulo}"? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelarEliminar}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmarEliminar}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UnaConferencia;
