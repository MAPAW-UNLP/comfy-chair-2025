import React from 'react';
import type { Conference } from './ConferenceApp';
import { useNavigate} from '@tanstack/react-router';
import { formatearFecha } from './AConference';
import { Edit } from 'lucide-react';

type ConferenceBoxProps = {
  conferencia: Conference;
};


function ConferenceBox({ conferencia }: ConferenceBoxProps) {
    const navigate= useNavigate()

  const irUnaConferencia= () =>{ 
    navigate({to: `/conference/${conferencia.id}`})
  }

  const irEditarConferencia = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate({to: `/conference/edit/${conferencia.id}`})
  }
  
  return (
    <div onClick={irUnaConferencia} className="flex flex-col bg-card hover:bg-card/60 max-w-[400px] sm:max-w-[500px] p-2 mb-2 rounded-sm gap-2 shadow border border-gray-400 cursor-pointer">

      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-0  w-[80%]">
          <b className='text-xs sm:text-sm md:text-md lg:text-lg truncate'>{conferencia.title.toUpperCase()}</b>
          <span className="text-sm">
            {formatearFecha(conferencia.start_date)}-{formatearFecha(conferencia.end_date)}
          </span>
        </div>
        <button
          onClick={irEditarConferencia}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Editar conferencia"
        >
          <Edit className="w-4 h-4 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default ConferenceBox;
