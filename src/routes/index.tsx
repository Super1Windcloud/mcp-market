import { createFileRoute } from '@tanstack/react-router'
import IndexRouteComponent from '@/components/routes/IndexRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/')({
  component: RouteComponent,
})