import { createFileRoute } from '@tanstack/react-router';
import ReviewArticle from '@/features/reviewer/ReviewArticle';

export const Route = createFileRoute('/reviewer/review/$articleId')({
  component: () => {
    const { articleId } = Route.useParams();
    const id = Number(articleId);
    return <ReviewArticle articleId={id} />;
  },
});
