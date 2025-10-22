import { createFileRoute } from '@tanstack/react-router'
import NewsRouteComponent from '@/components/routes/NewsRouteComponent'

export const Route = createFileRoute('/news')({
  component: NewsRouteComponent,
})