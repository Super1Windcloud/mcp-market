import { createFileRoute } from '@tanstack/react-router'
import EntertainmentRouteComponent from '@/components/routes/EntertainmentRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/entertainment')({
  component: RouteComponent,
})