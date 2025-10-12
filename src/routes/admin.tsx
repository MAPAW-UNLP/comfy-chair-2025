import AdministradorApp from '@/components/Administrador/AdministradorApp'
import { getConferenciasActivas } from '@/services/conferencias'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdministradorApp,
  loader: getConferenciasActivas
})

