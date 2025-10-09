import { createFileRoute } from '@tanstack/react-router';
import { RevisoresApp } from '@/components/revisor/RevisoresApp';

export const Route = createFileRoute('/articulos/$id/revisores')({
  component: RevisoresApp,
});
