import { createFileRoute } from '@tanstack/react-router'
import TravelRouteComponent from '@/components/routes/TravelRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/travel')({
  component: RouteComponent,
})