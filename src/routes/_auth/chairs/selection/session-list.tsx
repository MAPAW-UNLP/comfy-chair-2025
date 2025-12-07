import { createFileRoute } from '@tanstack/react-router';
import { SessionList } from '@/components/selection/SessionList';

export const Route = createFileRoute('/_auth/chairs/selection/session-list')({
  component: SessionList,
});

