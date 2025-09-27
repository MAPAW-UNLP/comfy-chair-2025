import AdministradorApp from '@/components/Administrador/AdministradorApp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdministradorApp,
})

