import { useState } from 'react';
import { createConferencia } from '@/services/conferencias';
import { useNavigate } from '@tanstack/react-router';
import type { Conferencia } from './AdministradorApp';
import FormConferencia from './FormConferencia';

function AltaConferencia() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (conf: Omit<Conferencia, 'id'>) => {
    setError('');
    setSuccess(false);
    try {
      await createConferencia(conf);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: '/admin' });
      }, 800);
    } catch (err: any) {
      setError(err.message)
    }
  };

  const agregarSesion = () => {};

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-3">
      <FormConferencia handleSubmit={handleSubmit} setError={setError}>
        {/* <div className="mt-2">
          <h3 className="font-semibold mb-2">Sesiones</h3>
          <Button
            size={'sm'}
            onClick={agregarSesion}
            className="cursor-pointer"
          >
            <Plus />
            Nueva sesión
          </Button>
        </div> */}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">Guardado correctamente</div>
        )}
      </FormConferencia>
    </div>
  );
}

export default AltaConferencia;
