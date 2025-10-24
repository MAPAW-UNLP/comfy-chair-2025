import { useEffect, useState } from 'react';
import { Route } from '@/routes/conference/edit/$id';
import { updateConference } from '@/services/conferenceServices';
import { useNavigate } from '@tanstack/react-router';
import ConferenceForm from './ConferenceForm';
import { getUserById, type User } from '@/services/userServices';
import type { Conference } from './ConferenceApp';

function ConferenceEdit() {
  const conferenciaInicial = Route.useLoaderData() as Conference;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [chairs, setChairs] = useState<User[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (conf: Omit<Conference, 'id'>, chairs: User[]) => {
    setError('');
    setSuccess(false);
    const updatedConf = { ...conf };

    if (updatedConf.start_date === conferenciaInicial.start_date) {
      delete updatedConf.start_date;
    } 
    if (updatedConf.end_date === conferenciaInicial.end_date) {
      delete  updatedConf.end_date;
    }
    try {
      await updateConference(conferenciaInicial.id, updatedConf, chairs);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: `/conference/${conferenciaInicial.id}` });
      }, 800);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const getChairs = async () => {
      const chairsIds = conferenciaInicial.chairs;
      const users: User[] = [];

      for (const ch of chairsIds) {
        const user = await getUserById(ch);
        users.push(user);
      }

      if (!isCancelled) {
        setChairs(users);
      }
    };

    getChairs();

    return () => {
      //Cancelo el seteo de chairs del efecto anterior si cambia conferenciaInicial.
      isCancelled = true;
    };
  }, [conferenciaInicial]);

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
