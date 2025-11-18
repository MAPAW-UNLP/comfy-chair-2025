import { createFileRoute } from "@tanstack/react-router"
import { SelectSessionChair } from '@/components/home/SelectSessionChair'

export const Route = createFileRoute("/_auth/chairs/select-session")({
  component: SelectSessionChair,
})
