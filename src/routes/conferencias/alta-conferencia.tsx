import AltaConferencia from '@/components/Administrador/AltaConferencia'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conferencias/alta-conferencia')({
  component: AltaConferencia,
})
