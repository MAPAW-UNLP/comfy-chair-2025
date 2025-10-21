import { createFileRoute } from '@tanstack/react-router';
import { ReviewerApp } from '@/components/reviewer/ReviewerApp';

export const Route = createFileRoute('/articulos/$id/revisores')({
  component: ReviewerApp,
});
