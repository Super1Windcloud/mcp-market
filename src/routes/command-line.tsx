import { createFileRoute } from '@tanstack/react-router'
import CommandLineRouteComponent from '@/components/routes/CommandLineRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/command-line')({
  component: RouteComponent,
})