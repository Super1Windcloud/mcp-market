import { createFileRoute } from '@tanstack/react-router'
import LocationRouteComponent from '@/components/routes/LocationRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/location')({
  component: RouteComponent,
})