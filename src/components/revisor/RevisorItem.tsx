import type { Revisor } from '@/services/revisor';
import type React from 'react';
import { useState } from 'react';

interface RevisorProps {
  revisor: Revisor;
}

export const RevisorItem: React.FC<RevisorProps> = ({ revisor }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAsignar = () => {
    setShowModal(true);
  };

  const handleCerrar = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col border p-2 rounded-md">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{revisor.nombre_completo}</p>
          <p className="text-sm text-gray-600">{revisor.email}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleAsignar}
        >
          Asignar
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="font-bold text-lg mb-4">Asignar Revisor</h2>
            <p>¿Deseas asignar a {revisor.nombre_completo} al artículo?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded border hover:bg-gray-100"
                onClick={handleCerrar}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                onClick={() => {
                  alert(`Revisor ${revisor.nombre_completo} asignado!`);
                  handleCerrar();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
