import { createFileRoute } from '@tanstack/react-router'
import TravelRouteComponent from '@/components/routes/TravelRouteComponent'

export const Route = createFileRoute('/travel')({
  component: TravelRouteComponent,
})
