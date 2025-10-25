import { createFileRoute } from '@tanstack/react-router'
import VersionControlRouteComponent from '@/components/routes/VersionControlRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/version-control')({
  component: RouteComponent,
})