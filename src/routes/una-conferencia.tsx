import UnaConferencia from '@/components/Administrador/UnaConferencia'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/una-conferencia')({
  component: UnaConferencia,
})

