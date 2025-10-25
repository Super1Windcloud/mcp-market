import { createFileRoute } from '@tanstack/react-router'
import MarketingRouteComponent from '@/components/routes/MarketingRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/marketing')({
  component: RouteComponent,
})