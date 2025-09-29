import React from 'react';
import type { Conferencia } from './AdministradorApp';
import { useNavigate} from '@tanstack/react-router';

type ConferenciaBoxProps = {
  conferencia: Conferencia;
};


function ConferenciaBox({ conferencia }: ConferenciaBoxProps) {
    const navigate= useNavigate()

  const irUnaConferencia= () =>{ 
    navigate({to: `/conferencias/${conferencia.id}`})
  }
  
  return (
    <div onClick={irUnaConferencia} className="flex flex-col bg-[#F1F5F9] hover:bg-[#E2E8F0] w-full p-2 rounded-sm gap-2 shadow cursor-pointer">

      <div className="flex justify-between items-center">
        <b>{conferencia.titulo}</b>
        <span className="text-sm">
          {conferencia.fecha_ini.replace(/-/g, '/')}-{conferencia.fecha_fin.replace(/-/g, '/')}
        </span>
      </div>

      <hr />

      <p>Chair Jose Hernandez</p> {/*a futuro conferencia.chair o parecido*/}
      <b>2 sesiones disponibles</b> {/*a futuro obtener sesiones*/}
    </div>
  );
}

export default ConferenciaBox;
