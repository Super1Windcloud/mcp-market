import { createFileRoute } from '@tanstack/react-router'
import ProductivityRouteComponent from '@/components/routes/ProductivityRouteComponent'

export const Route = createFileRoute('/productivity')({
  component: ProductivityRouteComponent,
})