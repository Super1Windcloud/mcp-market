import { createFileRoute } from '@tanstack/react-router'
import MonitoringRouteComponent from '@/components/routes/MonitoringRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/monitoring')({
  component: RouteComponent,
})