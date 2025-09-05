import { DummyApp } from '@/components/dummy/DummyApp';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dummy')({
  component: DummyApp,
});
