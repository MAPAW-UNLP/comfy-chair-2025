import { useNavigate, useRouterState } from '@tanstack/react-router';
import React from 'react';

type ItemProps = {
  nombre: string;
  Icon: React.ElementType;
  direccion: string;
  onNavigate?: () => void; // ← nuevo: cerrar sidebar al navegar
};

function ItemSidebar({ Icon, nombre, direccion, onNavigate }: ItemProps) {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const isActive = location.pathname === direccion;

  const goTo = () => {
    navigate({ to: direccion });
    // Cerrar sidebar inmediatamente después de disparar la navegación
    onNavigate?.();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLLIElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goTo();
    }
  };

  return (
    <li
      onClick={goTo}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-current={isActive ? 'page' : undefined}
      className={`py-3 pl-6 pr-20 cursor-pointer hover:bg-[#1b344e] outline-none
        ${isActive ? 'bg-[#1b344e]/70 font-semibold' : ''}`}
    >
      <div className="flex justify-between items-center">
        <span>{nombre}</span>
        <Icon className="w-5 h-5" />
      </div>
    </li>
  );
}

export default ItemSidebar;
