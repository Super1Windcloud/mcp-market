import { createFileRoute } from '@tanstack/react-router'
import LifestyleRouteComponent from '@/components/routes/LifestyleRouteComponent'

export const Route = createFileRoute('/lifestyle')({
  component: LifestyleRouteComponent,
})