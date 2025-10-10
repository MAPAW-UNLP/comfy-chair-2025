import { Home, ThumbsUp, FileText, Edit3, RotateCcw, User, X } from 'lucide-react';
import React from 'react';
import ItemSidebar from './ItemSidebar';

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const handleNavigate = () => setSidebarOpen(false);
  return (
    <>
      {sidebarOpen && ( //sidebar overlay
        <div
          className="fixed inset-0 bg-gray-600/20  z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`flex flex-col gap-5 bg-sidebar-primary text-sidebar-primary-foreground fixed top-0 left-0 h-full w-52 shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex p-3 mt-4">
          <X
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <ul className="flex flex-col"> {/*TODO: dependiendo el Rol mostrar un item u otro */}
          <hr />
          <ItemSidebar nombre="Home" Icon={Home} direccion="/" onNavigate={handleNavigate} />
          <hr />
          <hr />
          <ItemSidebar nombre="Bidding" Icon={ThumbsUp} direccion='/bidding' onNavigate={handleNavigate} />
          <hr />
          <ItemSidebar nombre="Artículos" Icon={FileText} direccion='/articulos' onNavigate={handleNavigate} />
          <hr />
          <ItemSidebar nombre="Revisiones" Icon={Edit3} direccion='/revisiones' onNavigate={handleNavigate} />
          <hr />
          <ItemSidebar nombre="Historial" Icon={RotateCcw} direccion='/historial' onNavigate={handleNavigate} />
          <hr />
          <ItemSidebar nombre="Mi perfil" Icon={User} direccion='/miperfil' onNavigate={handleNavigate} />
          <hr />
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
