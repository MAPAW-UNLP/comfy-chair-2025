// src/components/Inicio.tsx
import React, { useEffect, useState } from 'react';
import { fetchArticulos, type Articulo } from '@/services/articulosServices';

const Inicio: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticulos()
      .then((data) => {
        setArticulos(data);
      })
      .catch(() => {
        setError('No se pudieron cargar los artículos.');
      });
  }, []);

  const completados = articulos.filter((a) => a.estado === 'Completo').length;

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Bienvenido, Revisor</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4 w-1/2">
          {articulos.length === 0 ? (
            <>
              <span className="text-4xl font-bold">0</span>
              <span className="text-sm text-gray-600">artículos asignados</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold">03:23:22</span>
              <span className="text-sm text-gray-600">De Bidding</span>
            </>
          )}
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4 w-1/2">
          {articulos.length === 0 ? (
            <>
              <span className="text-4xl font-bold">Bidding</span>
              <span className="text-sm text-gray-600">completado</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold">
                {completados}/{articulos.length}
              </span>
              <span className="text-sm text-gray-600">
                Revisiones completadas
              </span>
            </>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Tus Artículos</h3>
      {articulos.length === 0 ? (
        <>
          <span className=" ">Sin asignar aun...</span>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-600">Pendiente de Bidding...</span>
        </>
      )}
      <ul className="space-y-3">
        {articulos.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center bg-white shadow rounded-lg p-3"
          >
            <span>{a.titulo}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                a.estado === 'Completo'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {a.estado}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inicio;
