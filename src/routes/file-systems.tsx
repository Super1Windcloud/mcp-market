import { createFileRoute } from '@tanstack/react-router'
import FileSystemsRouteComponent from '@/components/routes/FileSystemsRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/file-systems')({
  component: RouteComponent,
})