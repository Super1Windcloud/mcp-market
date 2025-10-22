import { createFileRoute } from '@tanstack/react-router'
import WeatherRouteComponent from '@/components/routes/WeatherRouteComponent'

export const Route = createFileRoute('/weather')({
  component: WeatherRouteComponent,
})