import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import ConferenciaBox from './ConferenciaBox';
import { useNavigate } from '@tanstack/react-router';
import {
  getConferenciasActivas,
  getConferenciasTerminadas,
} from '@/services/conferencias';
import { Route } from '@/routes/admin';
import { useEffect, useState } from 'react';
import { Buscador } from './Buscador';

type VISTA_CHOICES = 'single blind' | 'double blind' | 'completo';

export type Conferencia = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
  vista: VISTA_CHOICES;
};

function AdministradorApp() {
  const conferenciasInicial = Route.useLoaderData();
  const [conferencias, setConferencias] = useState<Conferencia[]>(conferenciasInicial);
  const [verActivas, setVerActivas] = useState<boolean>(true);
  const [confActivas, setConfActivas]= useState<Conferencia[]>([]);
  const [confTerminadas, setConfTerminadas]= useState<Conferencia[]>([]);
  const navigate = useNavigate();

  const irAltaConferencia = async () => {
    navigate({ to: '/conferencias/alta-conferencia' });
  };

  useEffect(() => {
    const actualizarConferencias = async () => {
      setConfActivas(await getConferenciasActivas())
      setConfTerminadas(await getConferenciasTerminadas())
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

      <div className="flex justify-between items-center gap-2 px-5 w-full">
        <Buscador confActivas={confActivas} confTerminadas={confTerminadas} setConferencias={setConferencias} verActivas={verActivas} />
        <Button
          size={'lg'}
          onClick={irAltaConferencia}
          className="cursor-pointer"
        >
          <Plus />
          Conferencia
        </Button>
      </div>

      <Tabs value={verActivas ? "activas" : "terminadas"} onValueChange={v => setVerActivas(v === "activas")} className="w-full flex items-center">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  justify-center items-center gap-3 w-full px-5">
        {conferencias.length > 0 ? (
          conferencias.map((c) => {
            return <ConferenciaBox key={c.id} conferencia={c} />;
          })
        ) : (
          <p>Aún no hay conferencias disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default AdministradorApp;
