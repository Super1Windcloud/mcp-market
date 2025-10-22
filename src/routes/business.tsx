import { createFileRoute } from '@tanstack/react-router'
import BusinessRouteComponent from '@/components/routes/BusinessRouteComponent'

export const Route = createFileRoute('/business')({
  component: BusinessRouteComponent,
})