import { createFileRoute } from '@tanstack/react-router';
import { ReviewArticleList } from '@/components/selection/ReviewArticleList'; 

type SearchParams = {
  sessionId: string;
  status: 'accepted' | 'rejected';
};

export const Route = createFileRoute('/chairs/selection/reviewed-article-list')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const status = search.status as 'accepted' | 'rejected';
    
    // Validación
    if (status !== 'accepted' && status !== 'rejected') {
      throw new Error('El parámetro status debe ser "accepted" o "rejected"');
    }

    return {
      sessionId: (search.sessionId as string) || '',
      status: status,
    };
  },
});

function RouteComponent() {
  const { sessionId, status } = Route.useSearch();
  const id = parseInt(sessionId);

  return <ReviewArticleList sessionId={id} status={status} />;
}