import React from 'react';
import type { Conferencia } from './AdministradorApp';
import { useNavigate} from '@tanstack/react-router';
import { formatearFecha } from './UnaConferencia';
import { Edit } from 'lucide-react';

type ConferenciaBoxProps = {
  conferencia: Conferencia;
};


function ConferenciaBox({ conferencia }: ConferenciaBoxProps) {
    const navigate= useNavigate()

  const irUnaConferencia= () =>{ 
    navigate({to: `/conferencias/${conferencia.id}`})
  }

  const irEditarConferencia = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el click del contenedor
    navigate({to: `/conferencias/editar/${conferencia.id}`})
  }
  
  return (
    <div onClick={irUnaConferencia} className="flex flex-col bg-card hover:bg-card/60 w-full p-2 mb-2 rounded-sm gap-2 shadow border border-gray-400 cursor-pointer">

      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0">
          <b className='text-xs sm:text-sm md:text-md lg:text-lg'>{conferencia.titulo.toUpperCase()}</b>
          <span className="text-sm">
            {formatearFecha(conferencia.fecha_ini)}-{formatearFecha(conferencia.fecha_fin)}
          </span>
        </div>
        <button
          onClick={irEditarConferencia}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Editar conferencia"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <hr />

      <p>Chair Jose Hernandez</p> {/*a futuro conferencia.chair o parecido*/}
      <b>0 sesiones disponibles</b> {/*a futuro obtener sesiones*/}
    </div>
  );
}

export default ConferenciaBox;
