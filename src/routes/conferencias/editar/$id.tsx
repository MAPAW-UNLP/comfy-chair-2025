import EditarConferencia from '@/components/Administrador/EditarConferencia'
import { getConferencia } from '@/services/conferencias'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conferencias/editar/$id')({
  component: EditarConferencia,
  loader: async ({ params }) => { return await getConferencia(params.id) }
})
