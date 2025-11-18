import { createFileRoute, Link } from "@tanstack/react-router"
import { HomeChair } from '@/components/home/HomeChair'

export const Route = createFileRoute("/_auth/chairs/home")({
  component: HomeChair,
})
