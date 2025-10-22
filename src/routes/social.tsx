import { createFileRoute } from '@tanstack/react-router'
import SocialRouteComponent from '@/components/routes/SocialRouteComponent'

export const Route = createFileRoute('/social')({
  component: SocialRouteComponent,
})