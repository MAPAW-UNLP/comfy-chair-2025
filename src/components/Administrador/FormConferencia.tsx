import React, { useEffect, useState } from 'react';
import Calendario from './Calendario';
import type { Conferencia } from './AdministradorApp';
import { Button } from '../ui/button';
import { Visualizacion } from './Visualizacion';

function esFechaValida(fecha1: string, fecha2: string) {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);

  return f2 >= f1;
}

type FormConferenciaProps = {
  handleSubmit: (conf: Omit<Conferencia, 'id'>) => Promise<void>;
  children: React.ReactNode;
  valorConferencia?: Omit<Conferencia, 'id'>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

function FormConferencia({
  handleSubmit,
  children,
  valorConferencia,
  setError,
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
    if (!esFechaValida(conferencia.fecha_ini, conferencia.fecha_fin)) {
      console.log('aca');
      setError(
        'La fecha de fin debe ser posterior o igual a la fecha de inicio'
      );
      return;
    }

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

  const actualizarVista = (v: Conferencia['vista']) => {
    setConferencia((prev) => ({ ...prev, vista: v }));
  }

  const validarFin = (d: Date) => {
    if (!conferencia.fecha_ini) return false;
    const [year, month, day] = conferencia.fecha_ini.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, day);
    return d >= fechaInicio;
  };

  useEffect(() => {
    if (valorConferencia) setConferencia(valorConferencia);
  }, [valorConferencia]);

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
      {/* <div className="flex flex-col gap-1">
        <label className="font-semibold">Usuario del Chair general</label>
        <p>Jose Hernandez</p>
      </div> */}

      {valorConferencia ? (
        <Visualizacion valorVisualizacion={valorConferencia.vista} actualizarVista={actualizarVista}/>
      ) : (
        <Visualizacion actualizarVista={actualizarVista} />
      )}

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
          type="button"
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
