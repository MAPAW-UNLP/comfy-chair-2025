import { createFileRoute } from '@tanstack/react-router'
import AltaArticulo from '@/components/articulo/altaArticulo';

export const Route = createFileRoute('/altaArticulo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div>
        <AltaArticulo></AltaArticulo>
      </div>
    )
}
