import { createFileRoute } from '@tanstack/react-router'
import MultimediaRouteComponent from '@/components/routes/MultimediaRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/multimedia')({
  component: RouteComponent,
})