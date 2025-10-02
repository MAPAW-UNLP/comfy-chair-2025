import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Armchair, Menu, X } from 'lucide-react';
import { useState } from 'react';

const RootLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dummy', label: 'Dummy' },
    { to: '/articulos', label: 'Mis Articulos' },
    { to: '/altaArticulo', label: 'Subir Articulo' },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar superior azul */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        {/* Links - en desktop a la izquierda */}
        <nav className="hidden md:flex gap-2 order-1 md:order-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-1 rounded-md hover:bg-gray-400 [&.active]:bg-slate-400 [&.active]:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Título - en desktop a la derecha */}
        <span className="font-bold text-lg order-2 md:order-2 ml-auto flex items-center gap-2">
          ComfyChair
          <Armchair />
        </span>

        {/* Botón de menú solo en móvil */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-1 rounded hover:bg-gray-700 order-0"
        >
          <Menu />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar móvil */}
        <aside
          className={`fixed z-20 top-0 left-0 h-full bg-slate-900 text-white w-64 transform transition-transform duration-300
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
        >
          <div className="flex items-center justify-between p-4">
            <span className="font-bold text-lg">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>
          <nav className="flex flex-col mt-4 gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 mx-2 py-2 rounded-md hover:bg-gray-700 [&.active]:bg-slate-400 [&.active]:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
