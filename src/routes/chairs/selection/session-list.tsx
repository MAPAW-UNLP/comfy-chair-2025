import { createFileRoute } from '@tanstack/react-router';
import { SessionList } from '@/components/selection/SessionList';

type SearchParams = {
  conferenceId: string; // Parámetro de búsqueda para el ID de la conferencia
};

export const Route = createFileRoute('/chairs/selection/session-list')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      conferenceId: (search.conferenceId as string || ''),
    };
  },
});

function RouteComponent() {
  const { conferenceId } = Route.useSearch();
  const id = parseInt(conferenceId);

  // Pasa el ID de la conferencia al componente SessionList
  return <SessionList conferenceId={id} />;
}