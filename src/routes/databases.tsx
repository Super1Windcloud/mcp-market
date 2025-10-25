import { createFileRoute } from '@tanstack/react-router'
import DatabasesRouteComponent from '@/components/routes/DatabasesRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/databases')({
  component: RouteComponent,
})