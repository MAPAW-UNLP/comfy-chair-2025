import React, { useEffect, useState } from 'react';
import CustomCalendar from './CustomCalendar';
import type { Conference } from './ConferenceApp';
import { Button } from '../ui/button';
import { ConferenceView } from './ConferenceView';
import { getAllUsers, type User } from '@/services/userServices';
import { UserCombobox } from '../combobox/UserCombobox';
import { X } from 'lucide-react';

function esFechaValida(fecha1: string, fecha2: string) {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);

  return f2 >= f1;
}

type ConferenceFormProps = {
  handleSubmit: (conf: Omit<Conference, 'id'>, chairs: User[]) => Promise<void>;
  children: React.ReactNode;
  valorConferencia?: Omit<Conference, 'id'>;
  valorChairs?: User[];
  setError: React.Dispatch<React.SetStateAction<string>>;
};

function ConferenceForm({
  handleSubmit,
  children,
  valorConferencia,
  valorChairs,
  setError,
}: ConferenceFormProps) {
  const [conferencia, setConferencia] = useState<Omit<Conference, 'id'>>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    blind_kind: 'single blind',
  });
  const [chairs, setChairs] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esFechaValida(conferencia.start_date, conferencia.end_date)) {
      setError(
        'La fecha de fin debe ser posterior o igual a la fecha de inicio'
      );
      return;
    }

    handleSubmit(conferencia, chairs);
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

  const actualizarVista = (v: Conference['blind_kind']) => {
    setConferencia((prev) => ({ ...prev, blind_kind: v }));
  };

  const validarFin = (d: Date) => {
    if (!conferencia.start_date) return false;
    const [year, month, day] = conferencia.end_date.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, day);
    return d >= fechaInicio;
  };

  const handleAddChair = (userId: number) => {
    const chair = users.find(u => u.id === userId);
    if (chair && !chairs.some(ch => ch.id === chair.id)) {
      setChairs([...chairs, chair]);
    }
  };

  const handleDeleteChair = (userId: number) => {
    setChairs(chairs.filter(ch => ch.id !== userId));
  };

  useEffect(() => {
    if (valorConferencia) setConferencia(valorConferencia);
  }, [valorConferencia]);

  useEffect(() => {
    if (valorChairs) setChairs(valorChairs);
  }, [valorChairs]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <form
      onSubmit={submit}
      className="mb-3 bg-card rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-5 w-9/10 lg:w-3/4 lg:max-w-[800px]"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-10 w-full">
        <div className="flex flex-col gap-5 lg:w-4/10">
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
              className="border rounded px-2 py-1 min-h-16"
              placeholder="Ingrese una descripción..."
              value={conferencia.description}
              name="description"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Chairs</label>
            <UserCombobox
              users={users}
              onValueChange={handleAddChair}
              isChair={true}
            />
            <div className="max-h-[150px] overflow-auto flex flex-col gap-2">
              {chairs.map((ch) => {
                return (
                  <div
                    key={ch.id}
                    className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-lg shadow-sm w-full"
                  >
                    <span className="truncate">
                      {ch.full_name} ({ch.email})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteChair(ch.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <CustomCalendar
            label="Fecha de inicio"
            date={conferencia.start_date}
            setDate={actualizarFechaInicio}
          />
          <CustomCalendar
            label="Fecha de cierre"
            date={conferencia.end_date}
            setDate={actualizarFechaFin}
            validarFin={validarFin}
          />
        </div>

        {valorConferencia ? (
          <ConferenceView
            valorVisualizacion={valorConferencia.blind_kind}
            actualizarVista={actualizarVista}
          />
        ) : (
          <ConferenceView actualizarVista={actualizarVista} />
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
          className="cursor-pointer bg-slate-900 text-white hover:bg-slate-700"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}

export default ConferenceForm;
