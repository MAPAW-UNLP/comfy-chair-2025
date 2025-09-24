import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <>
    <nav className="bg-slate-900 text-white border-b px-6 py-4 text-md flex gap-2">
      <Link to="/" className="px-3 py-1 rounded-md hover:bg-gray-400 [&.active]:bg-slate-400 [&.active]:text-white">
        Home
      </Link>
      <Link to="/dummy" className="px-3 py-1 rounded-md hover:bg-gray-400 [&.active]:bg-slate-400 [&.active]:text-white">
        Dummy
      </Link>
      <Link to="/articulos" className="px-3 py-1 rounded-md hover:bg-gray-400 [&.active]:bg-slate-400 [&.active]:text-white">
        Mis Articulos
      </Link>
    </nav>
    <main className="p-4">
      <Outlet />
    </main>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
