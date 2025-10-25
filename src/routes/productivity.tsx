import { createFileRoute } from '@tanstack/react-router'
import ProductivityRouteComponent from '@/components/routes/ProductivityRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/productivity')({
  component: RouteComponent,
})