import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import ConferenceBox from './ConferenceBox';
import { useNavigate } from '@tanstack/react-router';
import { getActiveConferences, getFinishedConferences } from '@/services/conferenceServices';
import { Route } from '@/routes/conference/view';
import { useEffect, useState } from 'react';
import { ConferenceSearch } from './ConferenceSearch';

type VISTA_CHOICES = 'single blind' | 'double blind' | 'completo';

export type Conference = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  blind_kind: VISTA_CHOICES;
};

function ConferenceApp() {
  const conferenciasInicial = Route.useLoaderData();
  const [conferencias, setConferencias] = useState<Conference[]>(conferenciasInicial);
  const [verActivas, setVerActivas] = useState<boolean>(true);
  const [confActivas, setConfActivas]= useState<Conference[]>([]);
  const [confTerminadas, setConfTerminadas]= useState<Conference[]>([]);
  const navigate = useNavigate();

  const irAltaConferencia = async () => {
    navigate({ to: '/conference/create' });
  };

  useEffect(() => {
    const actualizarConferencias = async () => {
      setConfActivas(await getActiveConferences())
      setConfTerminadas(await getFinishedConferences())
    };

    actualizarConferencias();
  }, [verActivas]);

  useEffect(() =>{
    if (verActivas) setConferencias(confActivas)
  },[confActivas])

  useEffect(() =>{
    if (!verActivas) setConferencias(confTerminadas)
  },[confTerminadas])

  return (
    <div className="flex flex-col justify-start items-center gap-5 mt-3">
      <h1 className="text-3xl font-bold">Conferencias</h1>

      <div className="flex justify-center items-center gap-2 px-5 w-full">
        <ConferenceSearch confActivas={confActivas} confTerminadas={confTerminadas} setConferencias={setConferencias} verActivas={verActivas} />
      </div>

      <div className="flex justify-between items-center w-full px-5">
        <div className="flex-1"></div>
        <Tabs value={verActivas ? "activas" : "terminadas"} onValueChange={v => setVerActivas(v === "activas")} className="flex items-center">
          <TabsList className='h-10 shadow'>
            <TabsTrigger
              value="activas"
              className="text-xs sm:text-sm cursor-pointer font-normal data-[state=active]:font-bold"
            >
              Activas
            </TabsTrigger>
            <TabsTrigger
              value="terminadas"
              className="text-xs sm:text-sm cursor-pointer font-normal data-[state=active]:font-bold"
            >
              Terminadas
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-1 flex justify-end">
          <Button
            size={'sm'}
            onClick={irAltaConferencia}
            className="cursor-pointer text-sm bg-slate-900 hover:bg-slate-700 text-white"
          >
            <Plus size={16} />
            Conferencia
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  justify-center items-center gap-3 w-full px-5">
        {conferencias.length > 0 ? (
          conferencias.map((c) => {
            return <ConferenceBox key={c.id} conferencia={c} />;
          })
        ) : (
          <p>Aún no hay conferencias disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default ConferenceApp;
