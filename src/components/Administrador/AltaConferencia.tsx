import React, { useState } from 'react';
import { createConferencia } from '@/services/conferencias';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';


function AltaConferencia() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usuarioChair, setUsuarioChair] = useState('');
  // El valor inicial debe ser uno de los VISTA_CHOICES
  const [visualizacion, setVisualizacion] = useState<'single blind' | 'double blind' | 'completo'>('single blind');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate= useNavigate()

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
      setTimeout(()=>{
        navigate({to: "/admin"})
      },1000)
    } catch (err: any) {
      setError('Error al guardar la conferencia');
    } finally {
      setLoading(false);
    }
  };

  const agregarSesion= ()=>{
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-3">
      <form
        onSubmit={handleSubmit}
        className="mb-3 bg-card rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-4 w-8/10 min-w-[250px]"
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
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="visualizacion"
                value="single blind"
                checked={visualizacion === 'single blind'}
                onChange={() => setVisualizacion('single blind')}
              />
              Single blind
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="visualizacion"
                value="double blind"
                checked={visualizacion === 'double blind'}
                onChange={() => setVisualizacion('double blind')}
              />
              Double blind
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
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
            <Button
              size={'sm'}
              onClick={agregarSesion}
              className="cursor-pointer"
            >
              <Plus />
              Nueva sesión
            </Button>
          {/* Aquí pondria las sesiones si tan solo tuviera una */}
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Guardado correctamente</div>}
        <div className="flex justify-between gap-1">
          <button
            type="button"
            className="bg-gray-400 text-white rounded px-6 py-2 font-semibold cursor-pointer hover:bg-gray-500"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white rounded px-6 py-2 font-semibold  cursor-pointer hover:bg-green-700"
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