import { createFileRoute } from '@tanstack/react-router'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/social')({
  component: RouteComponent,
})