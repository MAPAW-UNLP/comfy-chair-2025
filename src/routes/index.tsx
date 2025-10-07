import Inicio from '@/components/Reviews/Index';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <Inicio></Inicio>
    </div>
  );
}
