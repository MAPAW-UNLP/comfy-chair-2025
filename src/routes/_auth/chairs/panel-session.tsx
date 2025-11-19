import { createFileRoute } from "@tanstack/react-router"
import { Panel } from '@/components/panel-session/Panel'

export const Route = createFileRoute("/_auth/chairs/panel-session")({
  component: Panel,
})
