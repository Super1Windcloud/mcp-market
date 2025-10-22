import { createFileRoute } from '@tanstack/react-router'
import UtilitiesRouteComponent from '@/components/routes/UtilitiesRouteComponent'

export const Route = createFileRoute('/utilities')({
  component: UtilitiesRouteComponent,
})