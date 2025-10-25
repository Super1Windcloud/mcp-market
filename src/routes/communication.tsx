import { createFileRoute } from '@tanstack/react-router'
import CommunicationRouteComponent from '@/components/routes/CommunicationRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/communication')({
  component: RouteComponent,
})