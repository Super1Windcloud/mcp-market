import { createFileRoute } from '@tanstack/react-router'
import TtsRouteComponent from '@/components/routes/TtsRouteComponent'
import { RouteComponent } from "@/components/routes/BusinessRouteComponent";

export const Route = createFileRoute('/tts')({
  component: RouteComponent,
})