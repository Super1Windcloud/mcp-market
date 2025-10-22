import { createFileRoute } from '@tanstack/react-router'
import InformationRouteComponent from '@/components/routes/InformationRouteComponent'

export const Route = createFileRoute('/information')({
  component: InformationRouteComponent,
})