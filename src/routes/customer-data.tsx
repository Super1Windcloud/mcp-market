import { createFileRoute } from '@tanstack/react-router'
import CustomerDataRouteComponent from '@/components/routes/CustomerDataRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/customer-data')({
  component: RouteComponent,
})