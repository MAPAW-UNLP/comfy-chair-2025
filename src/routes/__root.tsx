import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { Armchair, Menu, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

const RootLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/conference/view', label: 'Conferencias' },
    { to: '/article/view', label: 'Articulos' },
    { to: '/article/select', label: 'Asignar Revisor' },
    { to: '/chairs/selection/session-list', label: 'Seleccionar corte' },
    { to: '/reviewer/bidding', label: 'Bidding' },
    { to: '/login', label: 'Ingresar' },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const routerState = useRouterState();
  const isHome = routerState.location.pathname === '/';

  return (
    <AuthProvider>
      <div className="flex flex-col h-screen">

        {/* Navbar superior */}
        <header className="relative bg-slate-900 text-white px-6 py-4 flex items-center justify-between md:justify-center">
          {!isHome && (
            <button
              onClick={handleBack}
              className="absolute left-4 p-2 rounded-md hover:bg-slate-700 flex items-center justify-center"
              title="Volver"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <nav className="hidden md:flex gap-4">
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

          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-1 rounded hover:bg-gray-700 ml-auto"
          >
            <Menu />
          </button>
        </header>


        {/* Cuerpo principal */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar móvil */}
          <aside
            className={`fixed z-20 top-0 right-0 h-full bg-slate-900 text-white w-64 transform transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            } md:hidden`}
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
                  onClick={() => setIsOpen(false)}
                  className="px-4 mx-2 py-2 rounded-md hover:bg-gray-700 [&.active]:bg-slate-400 [&.active]:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>

        <TanStackRouterDevtools />
        <Toaster richColors position="top-right" />

      </div>
    </AuthProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
