import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthProvider } from '@/contexts/AuthContext';

import { Armchair, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

// Definición del componente principal (layout raíz)
const RootLayout = () => {

  // Estado para controlar si el menú lateral móvil está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  // Lista de páginas principales de la aplicación
  const links = [
    { to: '/', label: 'Home' },
    { to: '/conference/view', label: 'Conferencias' },
    { to: '/articles/test', label: 'Articulos' },
    { to: '/article/create', label: 'Alta de Articulos' },
    { to: '/article/select', label: 'Asignar Revisor' },
    { to: '/chairs/selection/session-list', label: 'Seleccionar corte' },
    { to: '/reviewer/bidding', label: 'Bidding' },
    { to: '/login', label: 'Ingresar' },
  ];

  return (
    <AuthProvider>
    <div className="flex flex-col h-screen">

      {/* Navbar superior */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">

        {/* Navegación visible solo en pantallas medianas en adelante */}
        <nav className="hidden md:flex gap-2 order-1 md:order-1">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="px-3 py-1 rounded-md hover:bg-gray-400 [&.active]:bg-slate-400 [&.active]:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Nombre de la app + ícono */}
        <span className="font-bold text-lg order-2 md:order-2 ml-auto flex items-center gap-2">
          ComfyChair
          <Armchair />
        </span>

        {/* Botón colapsable (solo se muestra en móvil) */}
        <button onClick={() => setIsOpen(true)} className="md:hidden p-1 rounded hover:bg-gray-700 order-0"> {/*abre el sidebar móvil*/}
          <Menu />
        </button>

      </header>

      {/* Cuerpo principal de la aplicación */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar móvil (se desliza desde la izquierda) */}
        <aside className={`fixed z-20 top-0 left-0 h-full bg-slate-900 text-white w-64 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>

          {/* Encabezado del menú móvil */}
          <div className="flex items-center justify-between p-4">
            <span className="font-bold text-lg">Menu</span>
            
            {/* Botón para cerrar el menú */}
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          {/* Lista de enlaces de navegación (en columna) */}
          <nav className="flex flex-col mt-4 gap-2">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="px-4 mx-2 py-2 rounded-md hover:bg-gray-700 [&.active]:bg-slate-400 [&.active]:text-white" onClick={() => setIsOpen(false)}> {/*cierra el menú al navegar*/}
                {link.label}
              </Link>
            ))}
          </nav>

        </aside>

        {/* Área principal donde se renderizan las páginas hijas */}
        <main className="flex-1 overflow-auto">
          <Outlet /> {/* Outlet es el “espacio” donde TanStack Router inyecta la página actual */}
        </main>

      </div>

      {/* Herramientas de desarrollo del router (solo útiles en dev) */}
      <TanStackRouterDevtools />

      {/* Componente global de notificaciones tipo toast */}
      <Toaster position='top-right' />

    </div>
    </AuthProvider>
  );
};

// Exportamos la ruta raíz del enrutador, usando este layout como componente principal
export const Route = createRootRoute({ component: RootLayout });