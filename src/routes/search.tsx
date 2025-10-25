import { createFileRoute } from '@tanstack/react-router'
import SearchRouteComponent from '@/components/routes/SearchRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})