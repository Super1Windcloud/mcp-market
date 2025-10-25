import { createFileRoute } from '@tanstack/react-router'
import DataPlatformsRouteComponent from '@/components/routes/DataPlatformsRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/data-platforms')({
  component: RouteComponent,
})