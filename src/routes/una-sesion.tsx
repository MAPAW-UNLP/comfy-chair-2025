import UnaSesion from '@/components/Administrador/UnaSesion'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/una-sesion')({
  component: UnaSesion,
})

