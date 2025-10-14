import { useState } from 'react';
import { Route } from '@/routes/conference/$id';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from '@tanstack/react-router';
import { deleteConference } from '@/services/conferenceServices';

export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

function AConference() {
  const conferencia = Route.useLoaderData();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const irEditarConferencia = () => {
    navigate({ to: `/conference/edit/${conferencia.id}` });
  };

  // const agregarSesion = () => {};

  const goToHome = () => {
    navigate({ to: '/conference/view' });
  };

  const handleEliminarConferencia = () => {
    setShowDeleteModal(true);
  };

  const confirmarEliminar = async () => {
    setDeleting(true);
    try {
      await deleteConference(conferencia.id);
      navigate({ to: '/conference/view' }); // Redirigir después de eliminar
    } catch (error) {
      console.error('Error al eliminar conferencia:', error);
      alert('Error al eliminar la conferencia');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelarEliminar = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col mt-5 px-8 w-full gap-2 ">
        <div className="flex flex-col gap-1 bg-card rounded shadow border border-gray-200 p-5 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-2xl font-bold">
              {conferencia.title.toUpperCase()}
            </h1>
            <div
              onClick={irEditarConferencia}
              className="cursor-pointer rounded hover:bg-gray-200 p-1"
            >
              <Edit size={'15'} />
            </div>
          </div>

          <p className="text-sm">
            Desde {formatearFecha(conferencia.start_date)} a{' '}
            {formatearFecha(conferencia.end_date)}
          </p>
        </div>

        <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full">
          <h2 className="text-1xl font-bold">Descripción</h2>
          <p className="break-words">{conferencia.description}</p>
          <h2 className="text-1xl font-bold">Chair general</h2>
          <p>Jose Hernandez</p> {/*conferencia.chair*/}
        </div>

        <div className="flex flex-col bg-card rounded shadow border border-gray-200 p-5 w-full">
          <div className="flex justify-between">
            <h2 className="text-1xl font-bold">Sesiones disponibles</h2>
            {/* <Button
              size={'sm'}
              onClick={agregarSesion}
              className="cursor-pointer"
            >
              <Plus />
              Nueva sesión
            </Button> */}
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <Button variant={"secondary"} className='cursor-pointer bg-slate-900 text-white hover:bg-slate-700' onClick={goToHome}>Volver al inicio</Button>

          <Button
            variant="destructive"
            onClick={handleEliminarConferencia}
            className="flex items-center gap-2 cursor-pointer bg-red-900 text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
            Eliminar conferencia
          </Button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border-2 border-gray-300">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Estás seguro que deseas eliminar la conferencia "
              {conferencia.title}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelarEliminar}
                className="cursor-pointer"
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmarEliminar}
                className="cursor-pointer bg-red-900 text-white hover:bg-red-700"
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

export default AConference;
