import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold italic text-slate-500 text-center">
        Bienvenido, Usuario!
      </h1>
    </div>
  );
}
