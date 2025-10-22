import { createFileRoute } from '@tanstack/react-router'
import DevelopmentRouteComponent from '@/components/routes/DevelopmentRouteComponent'

export const Route = createFileRoute('/development')({
  component: DevelopmentRouteComponent,
})