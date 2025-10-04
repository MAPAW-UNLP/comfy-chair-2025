import React, { useEffect, useState } from 'react';
import Calendario from './Calendario';
import type { Conferencia } from './AdministradorApp';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

type FormConferenciaProps = {
  handleSubmit: (conf: Omit<Conferencia, 'id'>) => Promise<void>;
  children: React.ReactNode;
  valorConferencia?: Omit<Conferencia, 'id'>;
};

function FormConferencia({
  handleSubmit,
  children,
  valorConferencia,
}: FormConferenciaProps) {
  const [conferencia, setConferencia] = useState<Omit<Conferencia, 'id'>>({
    titulo: '',
    descripcion: '',
    fecha_ini: '',
    fecha_fin: '',
    vista: 'single blind',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(conferencia);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConferencia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const actualizarFechaInicio = (d: string) =>
    setConferencia((prev) => ({ ...prev, fecha_ini: d }));
  const actualizarFechaFin = (d: string) =>
    setConferencia((prev) => ({ ...prev, fecha_fin: d }));

  const validarFin = (d: Date) => {
    if (!conferencia.fecha_ini) return false;
    const [year, month, day] = conferencia.fecha_ini.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, day);
    return d >= fechaInicio;
  }

  useEffect(() => {
    if (valorConferencia) setConferencia(valorConferencia);
  }, []);

  return (
    <form
      onSubmit={submit}
      className="mb-3 bg-card rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-4 w-8/10 min-w-[250px]"
      style={{ maxWidth: 370 }}
    >
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Nombre de la conferencia</label>
        <input
          className="border rounded px-2 py-1"
          placeholder="Ingrese nombre..."
          value={conferencia.titulo}
          name="titulo"
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Descripción</label>
        <textarea
          className="border rounded px-2 py-1"
          placeholder="Ingrese una descripción..."
          value={conferencia.descripcion}
          name="descripcion"
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Usuario del Chair general</label>
        <p>Jose Hernandez</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Visualización</label>
        <Tabs
          value={conferencia.vista}
          onValueChange={(value) => setConferencia(prev => ({ ...prev, vista: value as 'single blind' | 'double blind' | 'completo' }))}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="single blind" className="text-xs sm:text-sm">
              Single blind
            </TabsTrigger>
            <TabsTrigger value="double blind" className="text-xs sm:text-sm">
              Double blind
            </TabsTrigger>
            <TabsTrigger value="completo" className="text-xs sm:text-sm">
              Completo
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Calendario
        label="Fecha de inicio"
        date={conferencia.fecha_ini}
        setDate={actualizarFechaInicio}
      />
      <Calendario
        label="Fecha de cierre"
        date={conferencia.fecha_fin}
        setDate={actualizarFechaFin}
        validarFin={validarFin}
      />

      {children}

      <div className="flex justify-between gap-1">
        <Button
          className="cursor-pointer bg-gray-500 hover:bg-gray-400"
          size={'lg'}
          type='button'
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant={'secondary'}
          size={'lg'}
          className="cursor-pointer"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}

export default FormConferencia;
