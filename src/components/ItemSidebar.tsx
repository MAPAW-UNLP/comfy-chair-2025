import { useNavigate } from '@tanstack/react-router';
import React from 'react';

type ItemProps = {
  nombre: string;
  Icon: React.ElementType;
  direccion: string;
  setSidebarOpen:(value: React.SetStateAction<boolean>) => void;
};

function ItemSidebar({ Icon, nombre, direccion, setSidebarOpen }: ItemProps) {
  const navigate= useNavigate();

  const goTo = () => {
    navigate({ to: direccion });
    setSidebarOpen(false)
  }

  return (
    <li onClick={goTo} className="hover:bg-[#1b344e] py-3 pl-6 pr-20 cursor-pointer">
      <div className="flex justify-between items-center ">
        <span>{nombre}</span>
        <Icon className="w-5 h-5" />
      </div>
    </li>
  );
}

export default ItemSidebar;
