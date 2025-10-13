import AConference from '@/components/conference/AConference'
import { getConference } from '@/services/conferenceServices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conferencias/$id')({
  component: AConference,
  loader: async ({ params }) => { return await getConference(params.id) },
})
