import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-3xl font-bold italic text-slate-500 text-center">Bienvenido, Usuario!</h1>
    </div>
  );
}
