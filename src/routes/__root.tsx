import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <>
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
      <Link to="/ingresar" className="[&.active]:font-bold">
        Ingresar
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
