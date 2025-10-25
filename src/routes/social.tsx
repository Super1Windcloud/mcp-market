import { createFileRoute } from '@tanstack/react-router'
import SocialRouteComponent from '@/components/routes/SocialRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/social')({
  component: RouteComponent,
})