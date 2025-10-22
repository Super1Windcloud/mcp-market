import { createFileRoute } from '@tanstack/react-router'
import HealthRouteComponent from '@/components/routes/HealthRouteComponent'

export const Route = createFileRoute('/health')({
  component: HealthRouteComponent,
})