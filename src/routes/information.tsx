import { createFileRoute } from '@tanstack/react-router'
import InformationRouteComponent from '@/components/routes/InformationRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/information')({
  component: RouteComponent,
})