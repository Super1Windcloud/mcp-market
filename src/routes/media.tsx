import { createFileRoute } from '@tanstack/react-router'
import MediaRouteComponent from '@/components/routes/MediaRouteComponent'

export const Route = createFileRoute('/media')({
  component: MediaRouteComponent,
})