import { DummyApp } from '@/components/dummy/DummyApp';
import { createFileRoute } from '@tanstack/react-router';

//URL de la página
export const Route = createFileRoute('/dummy')({
  //En vez de declarar el cuerpo del componente, importa el mismo
  component: DummyApp,
});
