import { createFileRoute } from '@tanstack/react-router'
import HealthRouteComponent from '@/components/routes/HealthRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/health')({
  component: RouteComponent,
})