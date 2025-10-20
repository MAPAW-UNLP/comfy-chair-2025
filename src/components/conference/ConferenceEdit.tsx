import { useEffect, useState } from 'react';
import { Route } from '@/routes/conference/edit/$id';
import {
  type Conference,
  updateConference,
} from '@/services/conferenceServices';
import { useNavigate } from '@tanstack/react-router';
import ConferenceForm from './ConferenceForm';
import type { User } from '@/services/userServices';

function ConferenceEdit() {
  const conferenciaInicial = Route.useLoaderData() as Conference;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [chairs, setChairs]= useState<User[]>([])
  const navigate = useNavigate();

  const handleSubmit = async (conf: Omit<Conference, 'id'>, chairs: User[]) => {
    setError('');
    setSuccess(false);
    try {
      await updateConference(conferenciaInicial.id, conf, chairs);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: `/conference/${conferenciaInicial.id}` });
      }, 800);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    //obtener users de una conferencia
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 mt-3">
      <ConferenceForm
        handleSubmit={handleSubmit}
        valorConferencia={conferenciaInicial}
        setError={setError}
        valorChairs={chairs}
      >
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">Guardado correctamente</div>
        )}
      </ConferenceForm>
    </div>
  );
}

export default ConferenceEdit;
