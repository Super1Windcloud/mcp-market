import { createFileRoute } from '@tanstack/react-router'
import DataScienceRouteComponent from '@/components/routes/DataScienceRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/data-science')({
  component: RouteComponent,
})