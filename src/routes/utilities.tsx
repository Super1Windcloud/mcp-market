import { createFileRoute } from '@tanstack/react-router'
import UtilitiesRouteComponent from '@/components/routes/UtilitiesRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/utilities')({
  component: RouteComponent,
})