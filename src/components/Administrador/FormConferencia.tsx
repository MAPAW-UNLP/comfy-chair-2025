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
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    blind_kind: 'single blind',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esFechaValida(conferencia.start_date, conferencia.end_date)) {
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
    setConferencia((prev) => ({ ...prev, start_date: d }));
  const actualizarFechaFin = (d: string) =>
    setConferencia((prev) => ({ ...prev, end_date: d }));

  const actualizarVista = (v: Conferencia['blind_kind']) => {
    setConferencia((prev) => ({ ...prev, blind_kind: v }));
  };

  const validarFin = (d: Date) => {
    if (!conferencia.start_date) return false;
    const [year, month, day] = conferencia.end_date.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, day);
    return d >= fechaInicio;
  };

  useEffect(() => {
    if (valorConferencia) setConferencia(valorConferencia);
  }, [valorConferencia]);

  return (
    <form
      onSubmit={submit}
      className="mb-3 bg-card rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-5 w-9/10 lg:w-3/4 lg:max-w-[800px]"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-10 w-full">
        <div className='flex flex-col gap-5 lg:w-4/10'>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Nombre de la conferencia</label>
            <input
              className="border rounded px-2 py-1"
              placeholder="Ingrese nombre..."
              value={conferencia.title}
              name="title"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Descripción</label>
            <textarea
              className="border rounded px-2 py-1"
              placeholder="Ingrese una descripción..."
              value={conferencia.description}
              name="description"
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="flex flex-col gap-1">
            <label className="font-semibold">Usuario del Chair general</label>
            <p>Jose Hernandez</p>
          </div> */}

          <Calendario
            label="Fecha de inicio"
            date={conferencia.start_date}
            setDate={actualizarFechaInicio}
          />
          <Calendario
            label="Fecha de cierre"
            date={conferencia.end_date}
            setDate={actualizarFechaFin}
            validarFin={validarFin}
          />
        </div>

        {valorConferencia ? (
          <Visualizacion
            valorVisualizacion={valorConferencia.blind_kind}
            actualizarVista={actualizarVista}
          />
        ) : (
          <Visualizacion actualizarVista={actualizarVista} />
        )}
      </div>

      {children}

      <div className="flex justify-end gap-2">
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
