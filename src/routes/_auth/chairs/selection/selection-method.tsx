import { createFileRoute } from '@tanstack/react-router';
import { SelectionMethod } from '@/components/selection/SelectionMethod';

export const Route = createFileRoute('/_auth/chairs/selection/selection-method')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SelectionMethod />;
}
