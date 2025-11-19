import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

import { Armchair, Menu, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

// Componente interno que usa el contexto de autenticación
const RootLayoutContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Funcionalidad de retroceso
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const routerState = useRouterState();
  const isPanelSession = routerState.location.pathname === '/chairs/select-session';
  //const isDashboard = routerState.location.pathname === '/dashboard';

  const commonLinks: { to: string; label: string }[] = [];

  const authLinks = user
    ? [
        // { to: '/reviewer/', label: 'Revisor' },
        // { to: '/conference/view', label: 'Conferencias' },
        // { to: '/article/view', label: 'Articulos' },
        { to: '/chairs/select-session', label: 'Lista de Sesiones'},
        { to: '/chairs/panel-session', label: 'Panel de Sesión'},
        { to: '/article/select', label: 'Articulos a Asignar' },
        { to: '/review/chair/reviewed', label: 'Articulos Revisados' },
        { to: '/chairs/selection/selection-method', label: 'Seleccionar Corte de Sesión' },
        // { to: '/reviewer/bidding', label: 'Bidding' },
        // { to: '/notifications', label: 'Notificaciones' },
        // { to: '/dashboard', label: 'Panel' },
      ]
    : [
        { to: '/login', label: 'Ingresar' },
        { to: '/register', label: 'Registrarse' },
      ];

  const links = [...commonLinks, ...authLinks];

  return (
    <div className="flex flex-col h-screen">

      {/* Navbar superior */}
      <header className="relative bg-slate-900 text-white px-6 py-4 flex items-center justify-between">

        {/* Flecha de retroceso (solo si no estamos en Home) */}
        {!isPanelSession && /*!isDashboard &&*/ (
          <button
            onClick={handleBack}
            className="absolute left-4 p-2 rounded-md hover:bg-slate-700 flex items-center justify-center md:hidden"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}


        {/* Navegación visible solo en pantallas medianas en adelante */}
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

        {/* Nombre de la app + ícono */}
        <div className="flex items-center gap-2 ml-auto order-2">
          <Link
            to="/chairs/select-session"
            className="font-bold text-lg flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            ComfyChair
            {/* Ícono visible solo en escritorio */}
            <Armchair className="hidden md:inline" />
          </Link>

          {/* Botón colapsable (solo móvil) */}
          {!isPanelSession && /*!isDashboard &&*/ (
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-1 rounded hover:bg-gray-700"
          >
            <Menu />
          </button>
          )}
        </div>
      </header>

      {/* Cuerpo principal */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar móvil (izquierda) */}
        {!isPanelSession && /*!isDashboard &&*/ (
          <aside
            className={`fixed z-20 top-0 left-0 h-full bg-slate-900 text-white w-64 transform transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
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
                  className="px-4 mx-2 py-2 rounded-md hover:bg-gray-700 [&.active]:bg-slate-400 [&.active]:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools />
      <Toaster position="top-right" />
    </div>
  );
};

// Layout raíz con el provider
const RootLayout = () => (
  <AuthProvider>
    <RootLayoutContent />
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
