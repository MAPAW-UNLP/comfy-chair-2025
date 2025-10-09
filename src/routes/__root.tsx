import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthProvider } from '@/contexts/AuthContext';

const RootLayout = () => (
  <AuthProvider>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/dummy" className="[&.active]:font-bold">
        Dummy
      </Link>
      <Link to="/registrarse" className="[&.active]:font-bold">
        Registrarse
      </Link>
      <Link to="/ingresar" search={{ redirect: undefined }} className="[&.active]:font-bold">
        Ingresar
      </Link>
      <Link to="/panel" className="[&.active]:font-bold">
        Panel
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
