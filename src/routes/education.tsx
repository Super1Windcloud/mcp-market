import { createFileRoute } from '@tanstack/react-router'
import EducationRouteComponent from '@/components/routes/EducationRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/education')({
  component: RouteComponent,
})