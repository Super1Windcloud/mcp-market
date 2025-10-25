import { createFileRoute } from '@tanstack/react-router'
import DeveloperToolsRouteComponent from '@/components/routes/DeveloperToolsRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/developer-tools')({
  component: RouteComponent,
})