import { createFileRoute } from '@tanstack/react-router'
import NewsRouteComponent from '@/components/routes/NewsRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/news')({
  component: RouteComponent,
})