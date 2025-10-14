import ConferenceCreate from '@/components/conference/ConferenceCreate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conference/create')({
  component: ConferenceCreate,
})
