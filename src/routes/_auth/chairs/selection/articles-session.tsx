import { createFileRoute } from '@tanstack/react-router';
import { SelectionPage } from '@/components/selection/SelectionPage';

type SearchParams = {
  sessionId: string;
};

export const Route = createFileRoute('/_auth/chairs/selection/articles-session')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      sessionId: (search.sessionId as string) || '',
    };
  },
});

function RouteComponent() {
  const { sessionId } = Route.useSearch();
  const id = parseInt(sessionId);

  return <SelectionPage sessionId={id} />;
}
