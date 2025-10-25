import { createFileRoute } from '@tanstack/react-router'
import SupportRouteComponent from '@/components/routes/SupportRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/support')({
  component: RouteComponent,
})