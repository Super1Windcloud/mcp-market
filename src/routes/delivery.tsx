import { createFileRoute } from '@tanstack/react-router'
import DeliveryRouteComponent from '@/components/routes/DeliveryRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/delivery')({
  component: RouteComponent,
})