

import React, { useState } from 'react';
import Header from './Header';
import { createConferencia } from '@/services/conferencias';

type Sesion = { nombre: string; descripcion: string };
function AltaConferencia() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usuarioChair, setUsuarioChair] = useState('');
  // El valor inicial debe ser uno de los VISTA_CHOICES
  const [visualizacion, setVisualizacion] = useState<'single blind' | 'double blind' | 'completo'>('single blind');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [sesiones, setSesiones] = useState<Sesion[]>([]);

  const handleNuevaSesion = () => {
    setSesiones([...sesiones, { nombre: '', descripcion: '' }]);
  };


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await createConferencia({
        titulo: nombre,
        descripcion,
        fecha_ini: fechaInicio,
        fecha_fin: fechaCierre,
        vista: visualizacion,
      });
      setSuccess(true);
    } catch (err: any) {
      setError('Error al guardar la conferencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EEEEEE] min-h-screen flex flex-col items-center">
      <Header />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 mt-8 w-[370px] flex flex-col gap-4"
        style={{ maxWidth: 370 }}
      >
        <h2 className="text-2xl font-bold mb-2">Agregar Conferencia</h2>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Nombre de la conferencia</label>
          <input
            className="border rounded px-2 py-1"
            placeholder="Ingrese nombre..."
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Descripción</label>
          <textarea
            className="border rounded px-2 py-1"
            placeholder="Ingrese una descripción..."
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Usuario del Chair general</label>
          <input
            className="border rounded px-2 py-1"
            placeholder="Ingrese usuario..."
            value={usuarioChair}
            onChange={e => setUsuarioChair(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Visualización</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="visualizacion"
                value="single blind"
                checked={visualizacion === 'single blind'}
                onChange={() => setVisualizacion('single blind')}
              />
              Single blind
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="visualizacion"
                value="double blind"
                checked={visualizacion === 'double blind'}
                onChange={() => setVisualizacion('double blind')}
              />
              Double blind
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="visualizacion"
                value="completo"
                checked={visualizacion === 'completo'}
                onChange={() => setVisualizacion('completo')}
              />
              Completo
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Fecha de inicio</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Fecha de cierre</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fechaCierre}
            onChange={e => setFechaCierre(e.target.value)}
            required
          />
        </div>
        <div className="mt-2">
          <div className="font-semibold mb-2">Sesiones</div>
          <button
            type="button"
            className="bg-[#0F172A] text-white rounded px-4 py-2 flex items-center gap-2"
            onClick={handleNuevaSesion}
          >
            + Nueva sesión
          </button>
          {/* Aquí pondria las sesiones si tan solo tuviera una */}
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Guardado correctamente</div>}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-400 text-white rounded px-6 py-2 font-semibold"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white rounded px-6 py-2 font-semibold"
            disabled={loading}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AltaConferencia