import { createFileRoute } from '@tanstack/react-router'
import IndexRouteComponent from '@/components/routes/IndexRouteComponent'

export const Route = createFileRoute('/')({
  component: IndexRouteComponent,
})