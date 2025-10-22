import { createFileRoute } from '@tanstack/react-router'
import FinanceRouteComponent from '@/components/routes/FinanceRouteComponent'

export const Route = createFileRoute('/finance')({
  component: FinanceRouteComponent,
})