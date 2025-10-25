import { createFileRoute } from '@tanstack/react-router'
import MediaRouteComponent from '@/components/routes/MediaRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/media')({
  component: RouteComponent,
})