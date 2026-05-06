import { createFileRoute } from '@tanstack/react-router'
import type { TrafficPoint } from '~/lib/types'

const TRAFFIC: TrafficPoint[] = [
  { day: 'Mon', visits: 320 },
  { day: 'Tue', visits: 410 },
  { day: 'Wed', visits: 380 },
  { day: 'Thu', visits: 520 },
  { day: 'Fri', visits: 610 },
  { day: 'Sat', visits: 460 },
  { day: 'Sun', visits: 540 },
]

export const Route = createFileRoute('/api/traffic')({
  server: {
    handlers: {
      GET: async () => Response.json(TRAFFIC),
    },
  },
})
