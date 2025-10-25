import { createFileRoute } from '@tanstack/react-router'
import DevelopmentRouteComponent from '@/components/routes/DevelopmentRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/development')({
  component: RouteComponent,
})