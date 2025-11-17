import { useEffect, useState } from 'react';
import { Route } from '@/routes/_auth/conference/edit/$id';
import { updateConference } from '@/services/conferenceServices';
import { useNavigate } from '@tanstack/react-router';
import ConferenceForm from './ConferenceForm';
import { getUserById, type User } from '@/services/userServices';
import type { Conference } from './ConferenceApp';
import { toast } from 'sonner';

function ConferenceEdit() {
  const conferenciaInicial = Route.useLoaderData() as Conference;
  const [chairs, setChairs] = useState<User[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (conf: Omit<Conference, 'id'>, chairs: User[]) => {
    const updatedConf = { ...conf };

    if (updatedConf.start_date === conferenciaInicial.start_date) {
      delete updatedConf.start_date;
    } 
    if (updatedConf.end_date === conferenciaInicial.end_date) {
      delete  updatedConf.end_date;
    }
    try {
      await updateConference(conferenciaInicial.id, updatedConf, chairs);
      toast.success('Conferencia actualizada correctamente');
        navigate({ to: `/conference/${conferenciaInicial.id}` });
    } catch (err: any) {
      toast.error(err.message);
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
        valorChairs={chairs}
      />
    </div>
  );
}

export default ConferenceEdit;
