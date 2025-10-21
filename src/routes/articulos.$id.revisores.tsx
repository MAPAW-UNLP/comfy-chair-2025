import { createFileRoute } from '@tanstack/react-router';
import { RevisoresApp } from '@/components/reviewer/ReviewerApp';

export const Route = createFileRoute('/articulos/$id/revisores')({
  component: RevisoresApp,
});
