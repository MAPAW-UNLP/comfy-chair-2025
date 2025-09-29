import Header from './Header';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import Tabs from './Tabs';
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
    navigate({ to: '/alta-conferencia' });

    //prueba
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
    <div className="flex flex-col justify-center items-center gap-5 bg-[#EEEEEE]">
      <Header />

      <h1 className="text-3xl font-bold">Conferencias</h1>

      <div className="flex justify-between items-center gap-2 px-5 w-full">
        <Buscador confActivas={confActivas} confTerminadas={confTerminadas} setConferencias={setConferencias} />
        <Button
          size={'lg'}
          onClick={irAltaConferencia}
          className="cursor-pointer"
        >
          <Plus />
          Conferencia
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-5 w-full px-5">
        <Tabs verActivas={verActivas} setVerActivas={setVerActivas} />
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
