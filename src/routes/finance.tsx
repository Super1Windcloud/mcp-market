import { createFileRoute } from '@tanstack/react-router'
import FinanceRouteComponent from '@/components/routes/FinanceRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/finance')({
  component: RouteComponent,
})