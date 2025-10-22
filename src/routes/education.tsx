import { createFileRoute } from '@tanstack/react-router'
import EducationRouteComponent from '@/components/routes/EducationRouteComponent'

export const Route = createFileRoute('/education')({
  component: EducationRouteComponent,
})