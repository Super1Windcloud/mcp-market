import { createFileRoute } from '@tanstack/react-router'
import LifestyleRouteComponent from '@/components/routes/LifestyleRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/lifestyle')({
  component: RouteComponent,
})