import UnaConferencia from '@/components/Administrador/UnaConferencia'
import { getConferencia } from '@/services/conferencias'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conferencias/$id')({
  component: UnaConferencia,
  loader: async ({ params }) => { return await getConferencia(params.id) }
})
