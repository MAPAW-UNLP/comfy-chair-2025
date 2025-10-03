import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import Sidebar from './Sidebar';

function Header() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goHome = () => {
    navigate({ to: '/admin' }); //TODO: Dependiendo el rol, ir a home del rol
  };

  return (
    <div className="flex justify-between items-center bg-primary w-full h-20 text-white p-3">
      <div className="cursor-pointer" onClick={() => setSidebarOpen(true)}>
        <Menu className="w-6 h-6" />
      </div>
      
      <div className="cursor-pointer mr-5" onClick={goHome}>
        <p className="text-2xl italic">ComfyChair</p>
      </div>

      <div> {/*Icono de usuario ?*/}</div>


      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>
  );
}

export default Header;
