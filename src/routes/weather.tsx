import { createFileRoute } from '@tanstack/react-router'
import WeatherRouteComponent from '@/components/routes/WeatherRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/weather')({
  component: RouteComponent,
})