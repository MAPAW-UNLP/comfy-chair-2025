import ConferenceApp from '@/components/conference/ConferenceApp'
import { getActiveConferences } from '@/services/conferenceServices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conference/view')({
  component: ConferenceApp,
  loader: getActiveConferences
})

