import { createFileRoute } from '@tanstack/react-router';
import { RevisoresApp } from '@/components/revisor/RevisoresApp';

export const Route = createFileRoute('/articles/$id/revisores')({
  component: RevisoresApp,
});
