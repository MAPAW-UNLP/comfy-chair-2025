import { createFileRoute } from '@tanstack/react-router';
import { ReviewerApp } from '@/components/reviewer/ReviewerApp';

export const Route = createFileRoute('/article/assign/$id')({
  component: ReviewerApp,
});
