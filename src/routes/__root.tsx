import Header from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@/components/ui/sonner';

const RootLayout = () => (
  <div className='bg-background'>
    <Header />
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
    <Toaster richColors position='top-right' />
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
