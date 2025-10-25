import { createFileRoute } from '@tanstack/react-router'
import SportsRouteComponent from '@/components/routes/SportsRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/sports')({
  component: RouteComponent,
})