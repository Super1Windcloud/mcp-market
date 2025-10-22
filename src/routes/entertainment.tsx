import { createFileRoute } from '@tanstack/react-router'
import EntertainmentRouteComponent from '@/components/routes/EntertainmentRouteComponent'

export const Route = createFileRoute('/entertainment')({
  component: EntertainmentRouteComponent,
})