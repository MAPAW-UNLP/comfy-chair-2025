// routes/articulos.tsx

import { createFileRoute } from '@tanstack/react-router';
import { ArticulosApp } from '@/components/articulos/ArticulosApp';

export const Route = createFileRoute('/articulos')({
    component: () => <ArticulosApp />,
});