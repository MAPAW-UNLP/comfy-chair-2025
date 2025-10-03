import React, { useState } from 'react';
import { Route } from '@/routes/conferencias/editar/$id';
import { type Conferencia } from '@/services/conferencias';
import api from '@/services/api';
import { useNavigate } from '@tanstack/react-router';
import FormConferencia from './FormConferencia';

function EditarConferencia() {
  const conferenciaInicial = Route.useLoaderData() as Conferencia;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (conf: Omit<Conferencia, 'id'>) => {
    setError('');
    setSuccess(false);
    try {
      await api.put(`/conferencias/${conferenciaInicial.id}/`, conf);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: `/conferencias/${conferenciaInicial.id}` });
      }, 1000);
    } catch (err: any) {
      setError('Error al guardar los cambios');
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 mt-3">
      <FormConferencia handleSubmit={handleSubmit} valorConferencia={conferenciaInicial}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">Guardado correctamente</div>
        )}
      </FormConferencia>
    </div>
  );
}

export default EditarConferencia;
